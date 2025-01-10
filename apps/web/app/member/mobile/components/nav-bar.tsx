import { LeftOutlined } from '@ant-design/icons';

interface NavBarProps {
    title?: string;
}

export const NavBar = ({ title }: NavBarProps) => {
    
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className=" z-50 flex items-center h-12 px-4 bg-white border-b border-gray-200">
            <button 
                onClick={handleGoBack}
                className="flex items-center justify-center w-8 h-8 -ml-2"
            >
                <LeftOutlined className="text-gray-600 text-lg" />
            </button>
            {title && (
                <h1 className="flex-1 text-center text-base font-medium text-gray-900 truncate">
                    {title}
                </h1>
            )}
        </div>
    );
}