export interface IEntityField {
  id: string;
  type: string;
  description: string;
}

export interface IEntity {
  id: string;
  fields: Array<IEntityField>;
}

export type TReferenceType = "embed" | "relation";
export type TRelationType = "one" | "many";

export interface IReference {
  type: TReferenceType;
  relationType?: TRelationType;
  source: string;
  target: string;
  sourceField?: string;
  targetField?: string;
  sourcePosition?: string;
  targetPosition?: string;
}

export interface IRawData {
  entities: Array<IEntity>;
  references: Array<IReference>;
}

export type GraphDirection = "TB" | "LR";
