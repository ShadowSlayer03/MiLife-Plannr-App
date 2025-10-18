
export const LoginPageContent = {
    heading: "Login",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    loginButtonText: "Login",
    signUpButtonText: "Signup"
}

export const SignupPageContent = {
    heading: "Signup",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    confirmPasswordPlaceholder: "Confirm Password",
    loginButtonText: "Login",
    signUpButtonText: "Signup"
}

export const LoadingPageContent = {
    loadingText: "Generating your list..."
}

export const ProfilePageContent = {
    errorText: "Error:",
    noUserLoggedInText: "No user logged in",
    profileDetailsText: "Profile Details",
    idText: "ID:",
    roleText: "Role:",
    providerText: "Provider:",
    statusText: "Status:",
    createdAtText: "Created At:",
    confirmedAtText: "Confirmed At:",
    lastSignInAt: "Last Sign In:",
    verificationText: "Verification",
    emailVerfiedText: "Email Verified:",
    phoneVerifiedText: "Phone Verified:"
}

export const NewProductPageContent = {
    pageTitle: "Add Product",

    nameLabel: "Product Name",
    subbrandLabel: "Subbrand",
    priceLabel: "Price",

    namePlaceholder: "e.g. Neustar Face Wash",
    subbrandPlaceholder: "e.g. Neustar",
    pricePlaceholder: "e.g. 499",

    addProductText: "Add Product",

    validationText: "Validation",
    successText: "Success",
    errorText: "Error",

    fillAllFieldsText: "Please fill all fields.",
    invalidPriceText: "Please enter a valid price.",
    addProductSuccessText: "Product added successfully!",

    notAuthorizedTitle: "You are not authorized to add products",
};

export const MyPlansPageContent = {
    headerTitle: "My Plans",
    loadingMessage: "Loading your plans...",
    errorTitle: "Error",
    errorMessage: "Failed to fetch plans",
    noPlansText: "No plans created yet.",
    budgetLabel: "Budget:",
    createdLabel: "Created:",
    toastErrorTitle: "Error",
};

export const PlanDetailPageContent = {
    loadingMessage: "Loading plan details...",
    errorText: "Error:",
    planNotFoundText: "Plan not found",

    budgetLabel: "Budget",
    adjustmentLabel: "Adjustment",
    createdLabel: "Created",

    productsHeader: "Products",
    subbrandLabel: "Sub-Brand:",
    priceLabel: "Price:",
    quantityLabel: "Qty:",

    noProductsText: "No products in this plan",
};

export const HomePageContent = {
    pageTitle: "Mi Plannr",
    budgetExceededTitle: "Budget exceeded!",
    loadingMessage: "Loading...",
};

export const GeneratedListPageContent = {
    pageTitle: "Generated List",
    totalPriceLabel: "Total Price",
    totalBVLabel: "Total BV",
    listEmptyText: "No items generated yet.",
    generateAgain: "Generate Again",
    continueText: "Continue",
    saveText: "Save",
    savingText: "Saving...",
    whatNextTitle: "What Next?",
    whatNextDescription: "Do you want to generate a 35BV list or submit directly?",
    generate35BVText: "Generate 35BV",
    submitDirectlyText: "Submit Directly",
    removeDescription: "Are you sure you want to remove this item from the list?",
    removeText: "Remove",
    saveErrorTitle: "Failed to save plan",
    loadingMessage: "Loading..."
};

export const InstructionsPageContent = {
    pageTitlePrefix: "How to use",
    pageTitleAppName: "Mi Plannr",
    steps: [
        {
            title: "Set your Budget",
            description:
                "Enter your total budget and an adjustment value (small extra margin).\nExample: ₹5000 + ₹500.",
            icon: "💰",
        },
        {
            title: "Choose Products",
            description:
                "Browse the list of products and add items you want.\nYou can only add until your budget limit is reached.",
            icon: "🛍️",
        },
        {
            title: "Generate Bill",
            description:
                "Once you've picked a few products, tap on 'Generate'.\nWe'll fill the remaining items so the total matches your budget (within adjustment).",
            icon: "🧾",
        },
        {
            title: "Review & Save",
            description:
                "Check your final bill, make changes if needed, and save your plan for later.",
            icon: "✅",
        },
    ],

    setBVText: "Set Budget for products",
};

export const BudgetSetupPageContent = {
    pageTitle: "Set Budget",
    budgetPlaceholder: "Enter your budget",
    adjustmentPlaceholder: "Enter adjustment",
    continueButton: "Continue",
    budgetNotSetError: "Budget not set",
    setBudgetForType: "Set Budget for {type} products",
};

// Component Content

export const NamePromptContent = {
    title: "Enter Plan Name",
    planNamePlaceholder: "My Monthly Plan",
    cancelButtonText: "Cancel",
    saveButtonText: "Save",
}

export const UserMenuContent = {
    signoutFailedText: "Signout failed",
    signoutSuccessfulTitleText: "Signed out",
    signoutSuccessfulDescText: "User signed out successfully",
    myPlansText: "My Plans",
    profileText: "Profile",
    addProductText: "Add Product",
    handleLangText: "Change Language",
    signOutText: "Sign Out"
}

export const ExportButtonContent = {
    title: "Download as {format}",
    buttonLoadingText: "Loading button" 
}

