import { useState } from 'react';

function useAnimatedLoader() {
    const [loading, setLoading] = useState(false);

    const startAnimatedLoading = () => {
        setLoading(true);
    };

    const stopAnimatedLoading = () => {
        setLoading(false);
    };

    const Loader = () => {
        return loading ? (
            <div className="mt-4">
                <table className="text-gradient table-fixed animate-pulse w-full">
                    <thead>
                        <tr>
                            {Array.from({ length: 4 }).map((_, index) => (

                                <th key={index} className="px-5 py-3 border-b-2 border-gray-200 bg-slate-400 text-left text-xs font-semibold ">
                                    ...
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <tr key={index}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-gray-200 text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">...</p>
                                    <p className="text-gray-600 whitespace-no-wrap">...</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-gray-200 text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">...</p>
                                    <p className="text-gray-600 whitespace-no-wrap">...</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-gray-200 text-sm">
                                    <span
                                        className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                                    >
                                        <span
                                            aria-hidden
                                            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                        ></span>
                                        <span className="relative">...</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-gray-200 text-sm space-x-2">
                                    <span
                                        className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                                    >
                                        <span
                                            aria-hidden
                                            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                        ></span>
                                        <span className="relative">...</span>
                                    </span>
                                    <span
                                        className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                                    >
                                        <span
                                            aria-hidden
                                            className="absolute inset-0 bg-yellow-300 opacity-50 rounded-full"
                                        ></span>
                                        <span className="relative">...</span>
                                    </span>
                                    <span
                                        className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                                    >
                                        <span
                                            aria-hidden
                                            className="absolute inset-0 bg-red-300 opacity-50 rounded-full"
                                        ></span>
                                        <span className="relative">...</span>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : null;
    };

    return { loading, startAnimatedLoading, stopAnimatedLoading, Loader };
}

export default useAnimatedLoader;
