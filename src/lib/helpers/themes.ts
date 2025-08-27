import type { ColorTheme } from "$lib/types";

export function getThemeById(themes: ColorTheme[], id: string) {
    const theme = themes.find((theme) => theme.id === id);
    console.log(themes, id, theme)
    if (theme) {
        return theme
    } else return null;
}