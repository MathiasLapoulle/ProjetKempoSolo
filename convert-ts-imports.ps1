# Script PowerShell pour remplacer les imports .ts par .js
$projectRoot = "c:\Users\mathi\Documents\ProjetKempo"

# Fonction pour remplacer les imports .ts par .js dans un fichier
function Convert-TsImports {
    param (
        [string]$filePath
    )
    
    Write-Host "Processing file: $filePath"
    
    # Lire le contenu du fichier
    $content = Get-Content -Path $filePath -Raw
    
    # Utiliser une expression régulière pour remplacer les imports .ts par .js
    $newContent = $content -replace '(import\s+.*from\s+[''"])([^''"]*)\.ts([''"])', '$1$2.js$3'
    
    # Rechercher d'autres patterns d'import avec .ts
    $newContent = $newContent -replace '([''"])([^''"]*)\.ts([''"])', '$1$2.js$3'
    
    # Vérifier si des modifications ont été apportées
    if ($content -ne $newContent) {
        # Écrire le nouveau contenu dans le fichier
        Set-Content -Path $filePath -Value $newContent
        Write-Host "✓ Updated imports in $filePath" -ForegroundColor Green
        return $true
    }
    
    return $false
}

# Trouver tous les fichiers .ts dans le projet
$tsFiles = Get-ChildItem -Path $projectRoot -Filter "*.ts" -Recurse | Where-Object { -not $_.FullName.Contains("node_modules") }

Write-Host "Found $($tsFiles.Count) TypeScript files to process"

$modifiedCount = 0

# Traiter chaque fichier
foreach ($file in $tsFiles) {
    $result = Convert-TsImports -filePath $file.FullName
    if ($result) {
        $modifiedCount++
    }
}

Write-Host "`nModification complete! Updated imports in $modifiedCount out of $($tsFiles.Count) files." -ForegroundColor Cyan
