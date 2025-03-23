from pydantic import BaseModel

class Investment(BaseModel):
    mutual_fund_id: str
    investment_date: str
    amount_invested: float
    nav_at_investment: float
    returns_since: float


class MutualFund(BaseModel):
    id: str
    name: str
    nav: float
    returns: float
    risk: float
    expense_ratio: float