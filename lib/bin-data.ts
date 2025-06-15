export interface BinItem {
    name: string
    icon: string
    dateDeleted: string
    originalLocation: string
}

export const DEFAULT_BIN_ITEMS: BinItem[] = [
    // Classic Windows 95 programs and files
    {
        name: "WINWORD.EXE",
        icon: "📝",
        dateDeleted: "08/24/1995",
        originalLocation: "C:\\MSOFFICE\\WINWORD"
    },
    {
        name: "AUTOEXEC.BAT",
        icon: "⚙️",
        dateDeleted: "09/15/1995",
        originalLocation: "C:\\"
    },
    {
        name: "CONFIG.SYS",
        icon: "⚙️",
        dateDeleted: "09/15/1995",
        originalLocation: "C:\\"
    },
    {
        name: "Letter to Mom.DOC",
        icon: "📄",
        dateDeleted: "07/12/1995",
        originalLocation: "C:\\MY DOCUME~1"
    },
    {
        name: "SOLITAIRE.EXE",
        icon: "🎮",
        dateDeleted: "10/03/1995",
        originalLocation: "C:\\WINDOWS"
    },
    {
        name: "MINESWEEPER.EXE",
        icon: "💣",
        dateDeleted: "10/03/1995",
        originalLocation: "C:\\WINDOWS"
    },
    {
        name: "DOOM.WAD",
        icon: "👹",
        dateDeleted: "11/20/1995",
        originalLocation: "C:\\GAMES\\DOOM"
    },
    {
        name: "BUDGET95.XLS",
        icon: "📊",
        dateDeleted: "06/30/1995",
        originalLocation: "C:\\EXCEL\\DOCS"
    },
    {
        name: "FAMILY PHOTO.BMP",
        icon: "🖼️",
        dateDeleted: "12/25/1995",
        originalLocation: "C:\\WINDOWS\\DESKTOP"
    },
    {
        name: "NETSCAPE.EXE",
        icon: "🌐",
        dateDeleted: "01/10/1996",
        originalLocation: "C:\\NETSCAPE"
    },
    {
        name: "NAPSTER.EXE",
        icon: "🎵",
        dateDeleted: "05/15/1995",
        originalLocation: "C:\\PROGRAM FILES\\NAPSTER"
    },
    {
        name: "QUAKE.EXE",
        icon: "🔫",
        dateDeleted: "08/22/1995",
        originalLocation: "C:\\GAMES\\QUAKE"
    },
    {
        name: "RESUME.WPD",
        icon: "📝",
        dateDeleted: "03/14/1995",
        originalLocation: "C:\\WORDPERF\\DOCS"
    },
    {
        name: "TRUMPET WINSOCK",
        icon: "📡",
        dateDeleted: "11/08/1995",
        originalLocation: "C:\\TRUMPET"
    },
    {
        name: "CDROM.SYS",
        icon: "💿",
        dateDeleted: "04/20/1995",
        originalLocation: "C:\\DOS"
    },
    {
        name: "MOUSE.COM",
        icon: "🖱️",
        dateDeleted: "02/28/1995",
        originalLocation: "C:\\DOS"
    },
    {
        name: "HIMEM.SYS",
        icon: "💾",
        dateDeleted: "09/30/1995",
        originalLocation: "C:\\DOS"
    },
    {
        name: "PKZIP.EXE",
        icon: "📦",
        dateDeleted: "12/01/1995",
        originalLocation: "C:\\UTILS"
    },
    {
        name: "COMMAND.COM",
        icon: "⬛",
        dateDeleted: "05/22/1995",
        originalLocation: "C:\\DOS"
    },
    {
        name: "DELTREE.EXE",
        icon: "🗂️",
        dateDeleted: "07/04/1995",
        originalLocation: "C:\\DOS"
    },
    {
        name: "SCANDISK.EXE",
        icon: "🔧",
        dateDeleted: "06/15/1995",
        originalLocation: "C:\\DOS"
    },
    {
        name: "DEFRAG.EXE",
        icon: "📀",
        dateDeleted: "08/10/1995",
        originalLocation: "C:\\DOS"
    },
    {
        name: "BACKUP.OLD",
        icon: "💾",
        dateDeleted: "01/30/1995",
        originalLocation: "C:\\BACKUP"
    }
] 