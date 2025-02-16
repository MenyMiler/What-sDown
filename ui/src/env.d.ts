interface ImportMetaEnv {
    readonly VITE_APP_IS_DOCKER: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
