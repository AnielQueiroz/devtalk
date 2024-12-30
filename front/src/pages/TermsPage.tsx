const Terms = () => {
    return (
        <div className="min-h-screen pt-28 sm:pt-16 container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="mb-4">
                Welcome to our developer community! By using our platform, you agree to abide by the following terms and conditions.
            </p>

            <h2 className="text-2xl font-semibold mt-4">1. Acceptable Use</h2>
            <p className="mb-2">Users must not upload illegal, harmful, or offensive content...</p>

            <h2 className="text-2xl font-semibold mt-4">2. Privacy Policy</h2>
            <p className="mb-2">We collect and store data such as your messages, uploads, and other activities...</p>

            <h2 className="text-2xl font-semibold mt-4">3. Termination</h2>
            <p className="mb-2">Accounts violating these terms may be suspended or terminated...</p>

            <a href="/terms.pdf" download className="btn btn-accent mt-6">
                Download as PDF
            </a>
        </div>
    );
};

export default Terms;
