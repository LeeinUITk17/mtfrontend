import { $fetch } from 'ofetch';

export default class MyUploadAdapter {
    private loader: any;
    private uploadUrl: string;
    private xhr?: XMLHttpRequest;

    constructor(loader: any, uploadUrl: string) {
        this.loader = loader;
        this.uploadUrl = uploadUrl;
    }

    upload(): Promise<{ default: string }> {
        return this.loader.file
            .then((file: File) => new Promise((resolve, reject) => {
                this._initRequest();
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    }

    abort(): void {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    private _initRequest(): void {
        const xhr = this.xhr = new XMLHttpRequest();
        xhr.open('POST', this.uploadUrl, true);
        xhr.responseType = 'json';
    }

    private _initListeners(resolve: (value: { default: string }) => void, reject: (reason?: any) => void, file: File): void {
        const xhr = this.xhr!;
        const loader = this.loader;
        const errorText = `Cannot upload file: ${file.name}.`;

        xhr.addEventListener('error', () => reject(errorText));
        xhr.addEventListener('abort', () => reject('Upload process was aborted.'));
        xhr.addEventListener('load', () => {
            const response = xhr.response;

            if (!response || response.error) {
                const errorMessage = response?.error?.message || errorText;
                return reject(errorMessage);
            }

            if (response.url) {
                resolve({ default: response.url });
            } else {
                reject(errorText + ' Invalid response format.');
            }
        });

        if (xhr.upload) {
            xhr.upload.addEventListener('progress', (evt: ProgressEvent) => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    private _sendRequest(file: File): void {
        const data = new FormData();
        data.append('upload', file);
        this.xhr!.send(data);
    }
}

export function MyCustomUploadAdapterPlugin(editor: any, uploadUrl: string): void {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return new MyUploadAdapter(loader, uploadUrl);
    };
}
