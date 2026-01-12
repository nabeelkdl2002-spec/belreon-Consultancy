export enum ProjectStatus {
  Completed = 'Completed',
  InProgress = 'In Progress',
  PendingApproval = 'Pending Approval',
  New = 'New',
  Rejected = 'Rejected',
}

export enum UserRole {
  PrimaryAdmin = 'Primary Admin',
  Employee = 'Employee',
}

export enum UserStatus {
  Active = 'Active',
  Disabled = 'Disabled',
}

export enum TransactionType {
  Inflow = 'Inflow',
  Outflow = 'Outflow',
}

export interface Project {
  clientName: string;
  service: string;
  assignedTo: string;
  status: ProjectStatus;
}

export interface Client {
  id: number;
  userId: string;
  password?: string;
  email: string;
  companyName: string;
  contactPerson: string;
  projectStatus: ProjectStatus;
  submissionDate?: string;
  phone?: string;
  address?: string;
  service?: string;
  projectDescription?: string;
  budget?: string;
  currency?: string;
  deadline?: string;
  isDeleted?: boolean;
  deletedBy?: string;
}

export interface User {
  id: number;
  username: string;
  password?: string;
  role: UserRole;
  permissions: string[];
  navPermissions: string[];
  status: UserStatus;
  isDeleted?: boolean;
  deletedBy?: string;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  clientVendor: string;
  type: TransactionType;
  amount: number;
  isDeleted?: boolean;
  deletedBy?: string;
}

export interface Stock {
  id: number;
  name: string;
  ticker: string;
  description: string;
  imageUrl: string;
  currentPrice: number;
  targetPrice: number;
  intrinsicValue: number;
  ratios: string;
  currency: string;
  isDemo: boolean;
  newsLink?: string;
  chartLink?: string;
  tradingViewLink?: string;
  isDeleted?: boolean;
  deletedBy?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  imageUrl?: string;
  url?: string;
  isDeleted?: boolean;
  deletedBy?: string;
}

export enum FinancialStatementCategory {
  Revenue = 'Revenue',
  Expense = 'Expense',
  Asset = 'Asset',
  Liability = 'Liability',
}

export interface FinancialStatementItem {
  id: number;
  date: string;
  particulars: string;
  description?: string;
  category: FinancialStatementCategory;
  amount: number;
  isDeleted?: boolean;
  transactionId: string;
  deletedBy?: string;
}

export type AboutUsIcon = 'LightbulbIcon' | 'UsersIcon' | 'BriefcaseIcon' | 'ChartPieIcon' | 'BanknotesIcon' | 'Cog6ToothIcon' | 'CalculatorIcon' | 'DatabaseIcon' | 'Squares2X2Icon';

export interface AboutUsFeature {
  id: number;
  icon: AboutUsIcon;
  title: string;
  description: string;
  isDeleted?: boolean;
  deletedBy?: string;
}

export interface AboutUsContent {
  mainImages: string[];
  heading: string;
  paragraph: string;
  features: AboutUsFeature[];
}