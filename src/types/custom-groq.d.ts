import { ModelList, Model } from "groq-sdk/resources/models.mjs";

// Groq's SDK is not up to date with their API, these types allow us to use full potential of their API
interface ExtendedModel extends Model {
    active?: Boolean;
    context_window?: Number;
}

interface ExtendedModelList extends ModelList {
    data?: Array<ExtendedModel>;
}