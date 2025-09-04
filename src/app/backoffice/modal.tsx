// modal component

interface ModalProps {
    title: string; 
    children: React.ReactNode;
    isOpen: boolean; //เอาไว้บอกว่า modal เปิดหรือปิด
    onClose: () => void; //เอาไว้ปิด modal
}

export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
    return (
        isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className={`bg-white rounded-lg shadow-lg w-1/2`}>
                    <h2 className="text-2xl mb-2 bg-teal-500 text-white p-4 rounded-t-lg">{title}
                        <button
                            className="float-right text-gray-300"
                            onClick={onClose}
                        ><i className="fa-solid fa-xmark"></i>
                        </button>
                    </h2>
                    <div className="mb-4 p-4">
                        {children}
                    </div>
                </div>
            </div> 
        )
    )
};    