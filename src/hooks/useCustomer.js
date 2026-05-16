import { useQuery } from "@tanstack/react-query";
import { customerService } from "../services/customer.service";

export const useCustomer = () => {
  //Get All Customers
  const getAllCustomersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getAllCustomers,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  //Get Customer By UUID
  const getCustomerByIdQuery = (customerId) => {
    return useQuery({
      queryKey: ['customer', customerId],
      queryFn: () => customerService.getCustomerById(customerId),
      enabled: !!customerId,
    });
  };

  //Get Customer Orders
  const getCustomerOrdersQuery = (customerId) => {
    return useQuery({
      queryKey: ['customer-orders', customerId],
      queryFn: () => customerService.getCustomerOrders(customerId),
      enabled: !!customerId,
    });
  }; 

  return {
    getAllCustomers: getAllCustomersQuery.data,
    isLoadingCustomers: getAllCustomersQuery.isFetching,
    customersError: getAllCustomersQuery.error,
    refetchCustomers: getAllCustomersQuery.refetch,

    getCustomerById: getCustomerByIdQuery,
    isLoadingCustomer: getCustomerByIdQuery.isFetching,
    customerError: getCustomerByIdQuery.error,
    refetchCustomer: getCustomerByIdQuery.refetch,

    // Get customer orders
    getCustomerOrders: getCustomerOrdersQuery,
    isLoadingCustomerOrders: getCustomerOrdersQuery.isFetching,
    customerOrdersError: getCustomerOrdersQuery.error,
    refetchCustomerOrders: getCustomerOrdersQuery.refetch,
    
  }
}
