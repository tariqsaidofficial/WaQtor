import { Demo } from './demo';

declare global {
    type Product = Demo.Product;
    type Customer = Demo.Customer;
    type Photo = Demo.Photo;
    type Country = Demo.Country;
    type Icon = Demo.Icon;
}

export {};
