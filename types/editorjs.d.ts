declare module "@editorjs/editorjs" {
  export default class EditorJS {
    constructor(config: any);
    save(): Promise<any>;
    render(data: any): Promise<void>;
    destroy(): void;
  }
}
