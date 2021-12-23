export interface InvestmentType {
    getCurrentWorth: ()=> Promise<number>
}