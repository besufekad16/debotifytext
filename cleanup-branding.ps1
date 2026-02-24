# Comprehensive branding cleanup script
$ErrorActionPreference = "Continue"

$replacements = @(
    @{Old = "www.unrobotictext.com"; New = "www.humanifylab.com"},
    @{Old = "https://unrobotictext.com"; New = "https://humanifylab.com"},
    @{Old = "unrobotictext.com"; New = "humanifylab.com"},
    @{Old = "unrobotictext@gmail.com"; New = "humanifylab@gmail.com"},
    @{Old = "@unrobotictext"; New = "@humanifylab"},
    @{Old = "/company/unrobotic-text"; New = "/company/humanifylab"},
    @{Old = "Unrobotic Text"; New = "HumanifyLab"},
    @{Old = "unrobotic text"; New = "humanifylab"},
    @{Old = "unrobotic-text"; New = "humanifylab"},
    @{Old = "UnroboticText.png"; New = "humanify.png"},
    @{Old = "Unrobotic"; New = "Humanify"},
    @{Old = "unrobotic"; New = "humanify"}
)

$files = Get-ChildItem -Path . -Filter "*.md" -File | Where-Object { $_.FullName -notmatch "node_modules" }
$updatedCount = 0

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        foreach ($replacement in $replacements) {
            $content = $content.Replace($replacement.Old, $replacement.New)
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "Updated: $($file.Name)" -ForegroundColor Green
            $updatedCount++
        }
    }
    catch {
        Write-Host "Error updating $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Cleanup complete! Updated $updatedCount files." -ForegroundColor Cyan
