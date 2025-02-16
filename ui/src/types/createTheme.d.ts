import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        class: {
            primary: string;
            secondary: string;
        };
        office: {
            primary: string;
            secondary: string;
        };
        bedroom: {
            primary: string;
            secondary: string;
        };
        addResource: {
            background: string;
            border: string;
            color: string;
        };
        addResourceYearly: {
            background: string;
            border: string;
            color: string;
        };
        viewResource: {
            background: string;
            border: string;
            color: string;
        };
        viewResourceYearly: {
            background: string;
            border: string;
            color: string;
        };
        yearlyGraphTable: {
            addResource: string;
            viewResource: string;
        };
    }

    interface PaletteOptions {
        class?: {
            primary?: string;
            secondary?: string;
        };
        office?: {
            primary?: string;
            secondary?: string;
        };
        bedroom?: {
            primary?: string;
            secondary?: string;
        };
        addResource?: {
            background?: string;
            border?: string;
            color?: string;
        };
        viewResource?: {
            background?: string;
            border?: string;
            color?: string;
        };
        yearlyGraphTable?: {
            addResource?: string;
            viewResource?: string;
        };
    }
}
