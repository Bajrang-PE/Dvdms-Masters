import toast from "react-hot-toast";

export const ToastAlert = (message, type = "default") => {
    switch (type) {
        case "success":
            return toast.success(message);

        case "error":
            return toast.error(message);

        case "loading":
            return toast.loading(message);

        case "custom":
            return toast(message);

        case "promise":
            return toast.promise;

        default:
            return toast(message);
    }
};
