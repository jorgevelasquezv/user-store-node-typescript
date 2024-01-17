import { v4 as uuidv4 } from 'uuid';

export class UUIdAdapter {
    static v4 = (): string => uuidv4();
}
