### `v3.1.0` - Pattern Helpers & Sharper Type Inference

This release adds ergonomic helpers for building patterns and improves return-type inference across the matching functions. It is backward compatible at runtime.

#### 🚀 Features

*   **New `pattern()` helper**: Define an object pattern with full literal type inference, so `match` can infer the exact union of possible results without explicit generic annotations.
*   **New `withDefault()` helper**: Add a default case to an object pattern without writing the `[last]` key inline — e.g. `withDefault({ active: 'green' } as const, 'grey')`.
*   **New `cond()` helper**: Define a conditional pattern with full literal type inference for branch results.
*   **Sharper inference**: `match`, `lazyMatch`, and `matchCond` now infer their return type as the precise union of pattern values instead of a single widened type. New exported helper types: `AllPatternValues`, `MatchResult`, and `InferCondResult`.

#### ⚠️ Note

*   The generic signatures of `match` and `lazyMatch` were reworked. Idiomatic usage (`match(key, pattern)`) is unaffected and now infers more precisely. If you previously passed **explicit** type arguments (e.g. `match<string, number>(...)`), update those call sites to rely on inference.

### `v3.0.0` - Modern, Type-Safe, and Consistent

This release marks a major milestone for `match-values`, focusing on full TypeScript support, a more consistent API, and an improved developer experience.

#### 🚀 Features & Improvements

*   **Full Type Safety**: The library is now fully type-safe with generics (`<T, R>`), providing robust type inference for both matched values and return types.
*   **Consistent Default Cases**: The `last` symbol is now the single, consistent way to define a default case for both object and conditional patterns.
*   **Simplified Object Matching**: The logic for object-based matching is now simpler and more robust, using direct property lookups instead of iteration.
*   **JSDoc Everything**: The entire library is now documented with JSDoc comments, providing better inline help in supported editors.
*   **Function Overloads**: The `match` and `lazyMatch` functions now use overloads for the best possible type inference.

#### 💥 BREAKING CHANGES

*   **Default Case for Object Patterns**: The string literal `'_'` is no longer supported for default cases in object patterns. You must now use the `last` symbol.

    **Before:**
    ```javascript
    match('c', { a: 1, b: 2, _: 3 });
    ```

    **After:**
    ```javascript
    import { match, last } from 'match-values';
    match('c', { a: 1, b: 2, [last]: 3 });
    ```
*   **Error Messages**: Error messages have been updated to be more descriptive. If you have tests that rely on specific error messages, they may need to be updated.
