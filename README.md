# Team #12

## Idea : Air Quality Determining Tax Costs

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
