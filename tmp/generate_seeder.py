import re

file_path = r'd:\Dev\Internal\pengawasan\public\sialma_departments_2026-04-09_145344.sql'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the values part of the INSERT statement
# It looks like INSERT INTO `departments` VALUES (1,...),(2,...);
match = re.search(r"INSERT INTO `departments` VALUES (.*?);", content, re.DOTALL)
if match:
    values_str = match.group(1).strip()
    
    # Split by ),( but be careful with commas inside strings.
    # A better way is to find all ( ... ) blocks.
    rows = re.findall(r"\((.*?)\)(?:,|$)", values_str, re.DOTALL)
    
    organizations = []
    ids_seen = set()

    for row in rows:
        # Split row by comma, but only if not inside quotes
        # row looks like: 1,'Name',NULL,NULL,NULL,NULL,NULL,NULL
        cols = re.findall(r"NULL|'[^']*'|\d+", row)
        if len(cols) >= 8:
            dept_id = cols[0]
            name = cols[1].strip("'")
            deleted_at = cols[2]
            address = cols[5].strip("'") if cols[5] != 'NULL' else None
            phone = cols[7].strip("'") if cols[7] != 'NULL' else None
            
            if deleted_at == 'NULL':
                # Map type
                org_type = 'Lainnya'
                name_upper = name.upper()
                if 'DINAS' in name_upper: org_type = 'Dinas'
                elif 'BADAN' in name_upper: org_type = 'Badan'
                elif 'KECAMATAN' in name_upper: org_type = 'Kecamatan'
                elif 'RSUD' in name_upper: org_type = 'RSUD'
                elif 'INSPEKTORAT' in name_upper: org_type = 'Inspektorat'
                elif 'SEKRETARIAT' in name_upper or 'SEKDA' in name_upper or 'DEWAN' in name_upper: org_type = 'Sekretariat'
                
                organizations.append({
                    'name': name,
                    'type': org_type,
                    'address': address,
                    'phone': phone
                })

    # Generate PHP code for seeder
    php_code = "<?php\n\nnamespace Database\\Seeders;\n\nuse App\\Models\\Organization;\nuse Illuminate\\Database\\Seeder;\n\nclass OrganizationSeeder extends Seeder\n{\n    /**\n     * Run the database seeds.\n     */\n    public function run(): void\n    {\n        $organizations = [\n"
    for org in organizations:
        name_esc = org['name'].replace("'", "\\'")
        type_esc = org['type']
        addr_esc = org['address'].replace("'", "\\'") if org['address'] else ""
        phone_esc = org['phone'].replace("'", "\\'") if org['phone'] else ""
        php_code += f"            ['name' => '{name_esc}', 'type' => '{type_esc}', 'address' => '{addr_esc}', 'phone' => '{phone_esc}', 'head_name' => '', 'description' => ''],\n"
    
    php_code += "        ];\n\n        foreach ($organizations as $org) {\n            Organization::create($org);\n        }\n    }\n}\n"
    
    with open(r'd:\Dev\Internal\pengawasan\database\seeders\OrganizationSeeder.php', 'w', encoding='utf-8') as f:
        f.write(php_code)
    print("Seeder generated successfully.")
else:
    print("Could not find INSERT statement.")
