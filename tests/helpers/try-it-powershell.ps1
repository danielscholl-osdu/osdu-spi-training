# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.

# Exercise authored examples with local fixtures only. No installer, credentials,
# Azure commands, or network requests run in this check.
$ErrorActionPreference = 'Stop'
$recipe = [Console]::In.ReadToEnd() | ConvertFrom-Json
foreach ($command in $recipe.commands) {
    $tokens = $null
    $parseErrors = $null
    [void][System.Management.Automation.Language.Parser]::ParseInput($command, [ref]$tokens, [ref]$parseErrors)
    if ($parseErrors.Count) { throw ($parseErrors | Out-String) }
}

function Invoke-RestMethod {
    if ($args[0] -ne 'https://api.github.com/repos/Azure/osdu-spi-stack/releases/latest') {
        throw 'Unexpected release endpoint'
    }
    return [pscustomobject]@{ assets = @(
        [pscustomobject]@{ name = 'notes.txt'; browser_download_url = 'https://example.invalid/notes.txt' },
        [pscustomobject]@{ name = 'spi-0.0.0-py3-none-any.whl'; browser_download_url = 'https://example.invalid/spi.whl' }
    ) }
}
function uv { $script:installerArgs = @($args) }
function spi {
    if ($args[0] -eq '--version') { return 'spi fixture' }
    if ($args[0] -eq 'token') { return 'fixture-token' }
    throw 'Unexpected SPI command'
}
function curl.exe { $script:requestArgs = @($args) }

Invoke-Expression $recipe.install | Out-Null
if (($script:installerArgs -join '|') -ne 'tool|install|--default-index|https://packagefeedproxy.microsoft.io/pypi/simple/|https://example.invalid/spi.whl') {
    throw 'The installer did not receive the wheel URL and package index as separate arguments'
}
Invoke-Expression $recipe.request
if (($script:requestArgs -join '|') -ne '-sS|-H|Authorization: Bearer fixture-token|https://fixture/api/partition/v1/partitions/opendes') {
    throw 'The API request did not preserve the bearer header or URL'
}
Write-Output "PowerShell $($PSVersionTable.PSVersion): parsed all commands; installer and bearer-header fixtures passed."
