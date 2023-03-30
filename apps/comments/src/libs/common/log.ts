export class Logger {
    static debug(message?: any, ...optionalParams: any[]): void {
        console.log(message, ...optionalParams);
    }

    static info(message?: any, ...optionalParams: any[]): void {
        console.log(message, ...optionalParams);
    }

    static error(message?: any, ...optionalParams: any[]): void {
        console.error(message, ...optionalParams);
    }

    static jsonError(format: string, error: any) {
        console.error(format, JSON.stringify(error, null, 2));
    }

    static json(format: string, data: any) {
        console.log(format, JSON.stringify(data, null, 2));
    }
}

const loggerWand: { [K: string]: Function } = {
    debug: Logger.debug,
    info: Logger.info,
    error: Logger.error,
    jsonError: Logger.jsonError,
    json: Logger.json
}

export function logAsync(logType: string = "info") {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const targetMethod = descriptor.value;

        descriptor.value = async function () {
            loggerWand[logType](`Method ${propertyKey} called with arguments ${JSON.stringify(arguments)}.`);
            return await targetMethod.apply(this, arguments);
        }
    }
}

export function logSync(logType: string = "info") {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const targetMethod = descriptor.value;

        descriptor.value = function () {
            loggerWand[logType](`Method ${propertyKey} called with arguments ${JSON.stringify(arguments)}.`);
            return targetMethod.apply(this, arguments);
        }

        return descriptor;
    }
}
