# Buy It Now Feature Flow

```mermaid
flowchart TD
    A[User clicks Buy It Now] --> B{Is user authenticated?}
    B -->|No| C[Show login dialog]
    C --> D[User signs in or cancels]
    D -->|Signs in| E[Proceed to checkout]
    D -->|Cancels| F[Return to product page]

    B -->|Yes| G{Is product in stock?}
    G -->|No| H[Show out of stock message]
    G -->|Yes| I{Does product have variants?}
    I -->|Yes| J[Show variant selection]
    I -->|No| K{Is cart empty?}
    K -->|No| L[Redirect to cart page]
    K -->|Yes| M[Create express cart]
    M --> N[Redirect to checkout with express=true]
    N --> O[Checkout page loads]
    O --> P{Is express checkout?}
    P -->|Yes| Q[Use express cart from sessionStorage]
    P -->|No| R[Use regular cart]
    Q --> S[Process payment]
    R --> S
    S --> T[Complete order]