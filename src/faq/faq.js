import './faq.css';

function FaqComponent() {
    return (
        <div className="faq">
            <h1>Frequently Asked Questions (FAQs)</h1>
            <div className="row">
                <div className="col-12 faq-container-item">
                    <div className="question-container">
                        <span className="question-logo">Q.</span>
                        <span className="question-details">Where is my order?</span>
                    </div>
                    <div className="answer-container">
                        <span className="answer-logo">A.</span>
                        <span className="answer-details">You may refer to our facebook page for updates, We make sure to update you as much as we can Got questions?</span>
                    </div>
                </div>
                <div className="col-12 faq-container-item">
                    <div className="question-container">
                        <span className="question-logo">Q.</span>
                        <span className="question-details">How long does it take for my order to be processed?</span>
                    </div>
                    <div className="answer-container">
                        <span className="answer-logo">A.</span>
                        <span className="answer-details">Due to the heavy load and COVID-19 Restrictions, it takes 1-2 working hours for us to process your order along Muntinlupa city, We ask for your epic patience</span>
                    </div>
                </div>
                <div className="col-12 faq-container-item">
                    <div className="question-container">
                        <span className="question-logo">Q.</span>
                        <span className="question-details">Do you have a store?</span>
                    </div>
                    <div className="answer-container">
                        <span className="answer-logo">A.</span>
                        <span className="answer-details">It is located at Alabang Muntinlupa City.</span>
                    </div>
                </div>
                <div className="col-12 faq-container-item">
                    <div className="question-container">
                        <span className="question-logo">Q.</span>
                        <span className="question-details">What are your store opening hours?</span>
                    </div>
                    <div className="answer-container">
                        <span className="answer-logo">A.</span>
                        <span className="answer-details">We are open every day, Drop by from 12:30 PM to 8:30 PM!</span>
                    </div>
                </div>
                <div className="col-12 faq-container-item">
                    <div className="question-container">
                        <span className="question-logo">Q.</span>
                        <span className="question-details">How much is your shipping fee?</span>
                    </div>
                    <div className="answer-container">
                        <span className="answer-logo">A.</span>
                        <span className="answer-details">It depends on your location. You can contact us for more information.</span>
                    </div>
                </div>
                <div className="col-12 faq-container-item">
                    <div className="question-container">
                        <span className="question-logo">Q.</span>
                        <span className="question-details">What is your mode of Payment?</span>
                    </div>
                    <div className="answer-container">
                        <span className="answer-logo">A.</span>
                        <span className="answer-details">As for now we are currently accepting payment only in COD(Cash on Delivery).</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FaqComponent;