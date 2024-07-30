/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IEntityField {
  id: string;
  types: string[];
  isPrimary?: boolean;
  isArray?: boolean;
  isAnyOf?: boolean;
  isAllOf?: boolean;
  description?: string;
  cast?: boolean;
  optional?: boolean;
  minLength?: number;
  maxLength?: number;
  minAmount?: number;
  maxAmount?: number;
  choices?: string[];
  patterns?: string[];
  startsAt?: Date | number;
  endsAt?: Date | number;
  expected?: any;
}

export interface IEntity {
  id: string;
  fields: Array<IEntityField>;
}

export type TReferenceType = "embed" | "relation";
export type TRelationType = "one" | "many";
export type TEdgePosition = "left" | "right";

export interface IReference {
  type: TReferenceType;
  relationType?: TRelationType;
  source: string;
  target: string;
  sourceField?: string;
  targetField?: string;
  sourcePosition?: TEdgePosition;
  targetPosition?: TEdgePosition;
}

export interface IRawData {
  entities?: Array<IEntity>;
  references?: Array<IReference>;
}

export type GraphDirection = "TB" | "LR";
