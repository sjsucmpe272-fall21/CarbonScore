# Team #12

## Idea #1:  Loan Assignment

1. Introduction to the problem statement

To predict if an applicant is capable of repaying a loan

2. Abstract (rough draft)

Home Credit is an international non-bank financial institution that makes borrowing accessible to low income groups. This population finds it tough to get loans from regular banking institutions due to insufficient credit histories. They are often exploited by untrustworthy lenders. So Home Credit primarily lends to people with little or no credit history. One constant challenge is the assessment of its clients' abilities to repay their loans. It has published many datasets with historical client and credit data. We propose a machine learning solution to help with the evaluation of its clients and predict if an applicant will be able to repay his loan.

3. Approach

Given an applicant's credit history, credit information with other financial institutions and balance details, we will use ML models to predict if he is capable of repaying the loan. The UI itself will be a form type interface where a borrower can input the following information.

4. Persona

Home Credit employees

5. Dataset links

https://www.kaggle.com/c/home-credit-default-risk/data
 
 
 
 
 
 



## Idea #2: Mental Health Identification

1. Introduction to the problem statement
		
To predict whether an employee is having mental illness in a tech workplace and provide the overall insights to the employer

2. Abstract (rough draft)
		
The global burden of mental health and the need for mental health support services remain major health issues throughout the world. Mental illnesses are often overlooked and not prioritized by governments and other stakeholders. In order to prioritize it in a tech workplace, a regular check has to be done if the employees are having sound mental health. In order to automate this, we propose an application which can be used both by employers and employees. The employers can view the overall mental health of all of their employees in the form of a dashboard. This insight would help them to make changes to the work environment and attempt to cheer all the employees. The employees in turn can go through some screening and can chat with a Virtual assistant(Chatbot) in case of any immediate assistance required.
		
3. Approach
	
An ML based model will be built which screens the employees with a couple of questions and predicts whether he has any mental illness like depression or anxiety with respect to work. If he is identified with some illness, a virtual assistant(chatbot) will help him to get proper help.

4. Persona
	
Employers/Employees of a organization, Government Officials

5. Dataset links
	
https://www.kaggle.com/osmi/mental-health-in-tech-survey
	
https://www.kaggle.com/arashnic/the-depression-dataset
	






## Idea #3: Stock Market/Securities Recommendation System

1. Introduction to the problem statement
	
To design a precise prediction model to score profits in the stock market.
 
2. Abstract (rough draft)
	
The stock market is very volatile. At the most basic level, it is said that supply and demand in the market determine the price of a stock. However, there is no set pattern, and it is influenced by many very different factors. If an effective algorithm could be established to anticipate the price of an individual stock, the risk of investing in the stock market could be reduced. The stock market's trajectory is largely influenced by large order transactions and we present an efficient stock recommendation model to the user by selecting some stocks which would add value to their portfolio. This is based on an indication of net inflow of the company to form the pre-recommended stock set for the target investor user. To recommend some stocks to target users who are familiar with this approach, we divide a large number of investors into several categories (based on Risk Level/Personal Interests/Financial Goals) and try our best to select companies from the stock set.
 
3. Approach
	
By taking into consideration the market volatility, stock behavior, price, and several other external reasons that might affect the stock’s performance on a particular date, we use an effective ML model to provide recommendations that can potentially preserve or grow a portfolio.
	
4. Persona
	
Investment Advisor/Stock Broker
 
5. Dataset links
	
https://www.kaggle.com/dgawlik/nyse

https://www.kaggle.com/borismarjanovic/price-volume-data-for-all-us-stocks-etfs
 



## Idea #4: Air Quality Determining Tax Costs

1. Introduction to the problem statement

If or when a carbon tax is ever implemented in the US, how much will each city/county/state be taxed over time?

2. Abstract (rough draft)
	
The rise of industrialization led to our society’s dependence on carbon which is a major driver of climate change. Because the issue of climate change directly affects all people for the foreseeable future, this prompts solutions from world governments such as the infamous “carbon tax”. A carbon tax is a tax imposed on emitters of the chemical carbon. Emitters could be an institution, company or any organization of people. In the following public dataset provided by the Environmental Protection Agency (EPA) to Google’s BigQuery, we are able to see identifying information on which building (via the building_name column) and the exact address of said building. We propose a platform to see a breakdown report that shows an aggregated list of building names/addresses and their carbon emission in the unit of parts per million. The total emission would be grouped by city/county/state and multiplied by some dollar amount to show the total tax at each level to date. The user will also be able to see an estimation (based on historical data) of how much tax will be based on the current consumption trend at each level. If time permits, an additional feature of drill down controls can be added to determine how much changing the consumption of each building/county/city/state will affect the overall total taxes.

3. Approach
    
There will be a landing page with a dashboard with a slider for the user to choose the year they want to see a breakdown of tax costs (in a range) per city/county/state with all the cost accrued by each building in a dropdown. A regression based model trained on the CO dataset will take in the year and calculate the predicted metric. This will plug into a  mathematical model to generate the dollar amount for tax.

4. Persona
	
Government Employees/Auditors

5. Dataset links

https://console.cloud.google.com/bigquery?project=clear-tape-314907&ws=!1m0!1m5!1m4!4m3!1sbigquery-public-data!2sepa_historical_air_quality!3sco_daily_summary&d=epa_historical_air_quality&p=bigquery-public-data&t=co_daily_summary&page=table

Table names: co_daily_summary, co_hourly_summary
