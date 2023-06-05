export {};

declare global {
    interface String {
        format(...args: any[]): string;
        appendPathSeparator(): string;
    }
}

String.prototype.format = function (...args: any[]): string {
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != "undefined" ? args[number] : match;
    });
};

String.prototype.appendPathSeparator = function (): string {
    return this.endsWith("/") ? this.toString() : this + "/";
};
