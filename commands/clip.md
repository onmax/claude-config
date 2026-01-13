---
description: Grab Windows clipboard image from WSL2 and read it
allowed-tools: Bash, Read
argument-hint: [optional description of what to do with image]
---

# Clipboard Image Reader (WSL2)

**Task**: $ARGUMENTS

## Steps

1. Run PowerShell from WSL to grab clipboard image:
   ```bash
   TIMESTAMP=$(date +%s)
   IMG_PATH="/tmp/clipboard_$TIMESTAMP.png"
   WIN_PATH=$(wslpath -w "$IMG_PATH")

   powershell.exe -Command "
     \$img = Get-Clipboard -Format Image
     if (\$img) {
       \$img.Save('$WIN_PATH')
       exit 0
     } else {
       Write-Host 'No image in clipboard'
       exit 1
     }
   "
   ```

2. If successful (exit 0), read the image file at `$IMG_PATH`

3. Process user's request about the image (from $ARGUMENTS)

## Notes
- User takes screenshot with Win+Shift+S first
- Always clean up temp files after reading
- If no $ARGUMENTS, just describe what you see
