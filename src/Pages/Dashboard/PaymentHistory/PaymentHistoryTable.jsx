import React from "react";

const PaymentHistoryTable = ({ payments }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Parcel Name</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Transaction ID</th>
                        <th>Paid At</th>
                    </tr>
                </thead>

                <tbody>
                    {payments.map((payment, index) => (
                        <tr key={payment._id}>
                            <td>{index + 1}</td>

                            {/* Parcel Name */}
                            <td>{payment.parcelName || payment.parcelId}</td>

                            {/* Email */}
                            <td>{payment.userEmail}</td>

                            {/* Amount */}
                            <td>{payment.amount}</td>

                            {/* Payment Method */}
                            <td className="capitalize">{payment.paymentMethod}</td>

                            {/* Transaction ID with truncation + tooltip */}
                            <td>
                                <span className="tooltip tooltip-primary" data-tip={payment.transactionId}>
                                    {payment.transactionId.slice(0, 6)}...
                                </span>
                            </td>

                            {/* Paid At */}
                            <td>{new Date(payment.paidAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {payments.length === 0 && (
                <p className="text-center mt-6 text-gray-500">
                    No payment history found
                </p>
            )}
        </div>
    );
};

export default PaymentHistoryTable;
