declare const useToggle: (defaultValue?: boolean) => {
    active: boolean;
    activate: () => void;
    deactivate: () => void;
    toggle: () => void;
};
export default useToggle;
