import { ItemEntity } from "../../../../modules/itens/core/entities/item.entity";

export type ListProps = {
    uuid: string;
    name: string;
    description?: string;
    userId: string;
    items: ItemEntity[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class ListEntity {
    constructor(private props: ListProps) {}

    get uuid(): string {
        return this.props.uuid;
    }

    get name(): string {
        return this.props.name;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get userId(): string {
        return this.props.userId;
    }

    get items(): ItemEntity[] {
        return this.props.items;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this.props.deletedAt;
    }

    set name(name: string) {
        this.props.name = name;
    }

    set description(description: string) {
        this.props.description = description;
    }

    addItem(item: ItemEntity): void {
        this.props.items.push(item);
    }

    removeItem(itemUuid: string): void {
        this.props.items = this.props.items.filter(item => item.uuid !== itemUuid);
    }

    output() {
        return {
            uuid: this.props.uuid,
            name: this.props.name,
            description: this.props.description,
            userId: this.props.userId,
            items: this.props.items.map(item => item.output()),
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}