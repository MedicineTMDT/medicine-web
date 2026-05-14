// Types
export type {
    DrugInteraction,
    DrugInteractionApiResponse,
    DrugInteractionListApiResponse,
    DrugInteractionPagedApiResponse,
    DrugInteractionPageResponse,
    MergedIngredientListApiResponse,
    MergedIngredientResponse,
    SeverityLevel
} from "./types";

export { normalizeSeverity } from "./types";

// API
export {
    getDrugInteractionsPaged,
    getDrugInteractionById,
    searchInteractionsByIngredients,
    suggestIngredients
} from "./data-access/drug-interactions.api";

// Queries
export {
    drugInteractionKeys,
    ingredientKeys,
    useDrugInteraction,
    useDrugInteractionsList,
    useIngredientSuggestions,
    useSearchInteractions
} from "./queries/drug-interactions.queries";
