// Types
export type {
    DrugInteraction,
    DrugInteractionApiResponse,
    DrugInteractionListApiResponse,
    MergedIngredientListApiResponse,
    MergedIngredientResponse,
    SeverityLevel
} from "./types";

export { normalizeSeverity } from "./types";

// API
export {
    getDrugInteractionById,
    searchInteractionsByIngredients,
    suggestIngredients
} from "./data-access/drug-interactions.api";

// Queries
export {
    drugInteractionKeys,
    ingredientKeys,
    useDrugInteraction,
    useIngredientSuggestions,
    useSearchInteractions
} from "./queries/drug-interactions.queries";

