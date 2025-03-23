class Investment(BaseModel):
    mutual_fund_id: str
    investment_date: str
    amount_invested: float
    nav_at_investment: float
    returns_since: float