$Cred = Get-Credential -Message "Enter Office 365 admin credentials"
$CsvPath = "C:\Path\To\Users.csv"
$Users = Import-Csv -Path $CsvPath
$SuccessLog = "C:\Path\To\stdout.txt"
$ErrorLog = "C:\Path\To\stderr.txt"

Connect-MsolService -Credential $Cred

foreach ($User in $Users) {
    if (-not $User.Email -or -not $User.Password) {
        "$((Get-Date).ToString('s')) - $($User.Email) - Skipped: Missing required fields" | Out-File -Append -FilePath $ErrorLog
        continue
    }

    try {
        $NewUser = New-MsolUser -UserPrincipalName $User.Email -DisplayName $User.Name -FirstName $User.FirstName -LastName $User.LastName -Password $User.Password -ForceChangePassword $false -ErrorAction Stop
        "$((Get-Date).ToString('s')) - $($User.Email) - Created Successfully" | Out-File -Append -FilePath $SuccessLog
        
        $UserObject = Get-MsolUser -UserPrincipalName $User.Email
        $GroupNames = $User.Groups -split " "

        foreach ($GroupName in $GroupNames) {
            if (-not [string]::IsNullOrEmpty($GroupName)) {
                $Group = Get-MsolGroup -All | Where-Object { $_.DisplayName -eq $GroupName }
                if ($Group) {
                    Add-MsolGroupMember -GroupObjectId $Group.ObjectId -GroupMemberType User -GroupMemberObjectId $UserObject.ObjectId
                    "$((Get-Date).ToString('s')) - $($User.Email) - Added to group $GroupName" | Out-File -Append -FilePath $SuccessLog
                }
                else {
                    "$((Get-Date).ToString('s')) - $($User.Email) - Group $GroupName not found" | Out-File -Append -FilePath $ErrorLog
                }
            }
        }
    }
    catch {
        "$((Get-Date).ToString('s')) - $($User.Email) - Error: $_" | Out-File -Append -FilePath $ErrorLog
    }
}

try {
    [Microsoft.Online.Administration.Automation.ConnectMsolService]::ClearTokenCache()
}
catch {
    "$((Get-Date).ToString('s')) - Token cache cleanup failed: $_" | Out-File -Append -FilePath $ErrorLog
    exit
}
