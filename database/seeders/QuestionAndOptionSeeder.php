<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Option;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class QuestionAndOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Clear existing questions and options to avoid duplicates if re-run
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Question::truncate();
        Option::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // 2. Parse Statements (Questions)
        $statementsSql = File::get(public_path('sialma_statements_2026-04-10_081632.sql'));
        $questions = $this->parseSqlValues($statementsSql);

        $oldToNewIdMap = [];

        foreach ($questions as $q) {
            // Mapping: (id, sub_aspect_id, title, criteria, description, law_reference, helper, created_at, updated_at)
            $oldId = (int)$q[0];
            $subAspectId = (int)$q[1];
            $text = $this->stripQuotes($q[2]);
            $instruction = $this->stripQuotes($q[4]); // description
            $legalBasis = $this->stripQuotes($q[5]); // law_reference

            $newQuestion = Question::create([
                'id' => $oldId, // Keep ID to maintain relations with options
                'sub_aspect_id' => $subAspectId,
                'text' => $text,
                'instructions' => $instruction,
                'legal_basis' => $legalBasis,
            ]);

            $oldToNewIdMap[$oldId] = $newQuestion->id;
        }

        // 3. Parse Statement Options (Options)
        $optionsSql = File::get(public_path('sialma_statement_options_2026-04-10_081819.sql'));
        $optionsData = $this->parseSqlValues($optionsSql);

        foreach ($optionsData as $o) {
            // Mapping: (id, statement_id, title, description, criteria, score, level, created_at, updated_at)
            $statementId = (int)$o[1];
            $optionText = $this->stripQuotes($o[2]);
            $score = (int)$o[5];

            if (isset($oldToNewIdMap[$statementId])) {
                Option::create([
                    'question_id' => $oldToNewIdMap[$statementId],
                    'text' => $optionText,
                    'score' => $score,
                ]);
            }
        }
    }

    /**
     * Primitive SQL values parser
     */
    private function parseSqlValues($sql)
    {
        // Extract content after "INSERT INTO ... VALUES "
        if (preg_match('/INSERT INTO `[^`]+` VALUES\s*(.*);/is', $sql, $matches)) {
            $valuesContent = trim($matches[1]);
            
            // Split by "),(" while respecting nested parentheses in strings
            // This is a simplified split, might need refinement for complex SQL
            $rows = [];
            $currentChar = '';
            $inString = false;
            $parenthesesLevel = 0;
            $currentRowContent = '';

            for ($i = 0; $i < strlen($valuesContent); $i++) {
                $char = $valuesContent[$i];
                
                if ($char === "'" && ($i === 0 || $valuesContent[$i-1] !== '\\')) {
                    $inString = !$inString;
                }

                if (!$inString) {
                    if ($char === '(') $parenthesesLevel++;
                    if ($char === ')') $parenthesesLevel--;
                }

                if ($char === ',' && $parenthesesLevel === 0 && !$inString) {
                    // Start of next row or just a separator (if it was between rows)
                    continue; 
                }

                $currentRowContent .= $char;

                if ($parenthesesLevel === 0 && !$inString && strlen(trim($currentRowContent)) > 0) {
                    $row = trim($currentRowContent);
                    if (str_starts_with($row, '(') && str_ends_with($row, ')')) {
                        $inner = substr($row, 1, -1);
                        $rows[] = $this->splitValues($inner);
                    }
                    $currentRowContent = '';
                }
            }
            return $rows;
        }
        return [];
    }

    private function splitValues($inner)
    {
        $fields = [];
        $currentField = '';
        $inString = false;
        
        for ($i = 0; $i < strlen($inner); $i++) {
            $char = $inner[$i];
            
            if ($char === "'" && ($i === 0 || $inner[$i-1] !== '\\')) {
                $inString = !$inString;
            }

            if ($char === ',' && !$inString) {
                $fields[] = trim($currentField);
                $currentField = '';
            } else {
                $currentField .= $char;
            }
        }
        $fields[] = trim($currentField);
        return $fields;
    }

    private function stripQuotes($str)
    {
        if ($str === 'NULL') return null;
        if (str_starts_with($str, "'") && str_ends_with($str, "'")) {
            $str = substr($str, 1, -1);
            // Unescape single quotes and other characters escaped by MySQL dump
            $str = str_replace(["\\'", "\\\"", "\\\\", "\\n", "\\r", "\\t"], ["'", "\"", "\\", "\n", "\r", "\t"], $str);
            return $str;
        }
        return $str;
    }
}
