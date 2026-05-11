$carpeta = $PSScriptRoot
$repo = $carpeta

Write-Host "Sincronizacion automatica activa" -ForegroundColor Green
Write-Host "Carpeta: $carpeta" -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para detener`n" -ForegroundColor Yellow

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $carpeta
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName

$timer = New-Object System.Timers.Timer
$timer.Interval = 3000
$timer.AutoReset = $false

$changed = $false

$action = {
    $global:changed = $true
    $global:timer.Stop()
    $global:timer.Start()
}

$pushAction = {
    if ($global:changed) {
        $global:changed = $false
        $timestamp = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
        Write-Host "[$timestamp] Cambios detectados - subiendo a GitHub..." -ForegroundColor Yellow
        Set-Location $using:repo
        git add -A
        $status = git status --porcelain
        if ($status) {
            git commit -m "Actualizacion automatica $timestamp" 2>&1 | Out-Null
            git push 2>&1 | Out-Null
            Write-Host "[$timestamp] Subido correctamente" -ForegroundColor Green
        }
    }
}

Register-ObjectEvent $watcher "Changed" -Action $action | Out-Null
Register-ObjectEvent $watcher "Created" -Action $action | Out-Null
Register-ObjectEvent $watcher "Deleted" -Action $action | Out-Null
Register-ObjectEvent $watcher "Renamed" -Action $action | Out-Null
Register-ObjectEvent $timer "Elapsed" -Action $pushAction | Out-Null

$watcher.EnableRaisingEvents = $true

Write-Host "Esperando cambios en los archivos..." -ForegroundColor Cyan

try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    $timer.Dispose()
    Write-Host "`nSincronizacion detenida." -ForegroundColor Red
}
