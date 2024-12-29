import React from 'react';
import { Modal as FlowbiteModal, Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamation, HiX } from 'react-icons/hi';

const Modal = ({
  show,
  onClose,
  title,
  titleUrdu,
  children,
  size = 'md',
  dismissible = true,
  // Action buttons configuration
  primaryAction,
  secondaryAction,
  // For confirmation modals
  isConfirmation = false,
  confirmationIcon = HiOutlineExclamation,
  // Additional props
  className,
  ...props
}) => {
  const {language} = useSelector(state => state.language) || 'en';

  return (
    <FlowbiteModal
      show={show}
      onClose={onClose}
      size={size}
      dismissible={dismissible}
      className={className}
      {...props}
    >
      {/* Header */}
      <FlowbiteModal.Header className="relative">
        {title || titleUrdu && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {language === 'ur' ? titleUrdu : title}
          </h3>
        )}
        {dismissible && (
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <HiX className="w-5 h-5" />
          </button>
        )}
      </FlowbiteModal.Header>

      {/* Body */}
      <FlowbiteModal.Body>
        {isConfirmation ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
              {React.createElement(confirmationIcon, {
                className: "h-6 w-6 text-yellow-600 dark:text-yellow-400"
              })}
            </div>
            {children}
          </div>
        ) : (
          children
        )}
      </FlowbiteModal.Body>

      {/* Footer with Actions */}
      {(primaryAction || secondaryAction) && (
        <FlowbiteModal.Footer>
          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
            {secondaryAction && (
              <Button
                color="gray"
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {language === 'ur' ? secondaryAction.labelUrdu : secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                gradientDuoTone={primaryAction.gradientDuoTone || "purpleToBlue"}
                onClick={primaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {language === 'ur' ? primaryAction.labelUrdu : primaryAction.label}
              </Button>
            )}
          </div>
        </FlowbiteModal.Footer>
      )}
    </FlowbiteModal>
  );
};

// Convenience methods for common modal types
Modal.confirm = ({
  title,
  titleUrdu,
  message,
  messageUrdu,
  onConfirm,
  onCancel,
  confirmLabel,
  confirmLabelUrdu,
  cancelLabel,
  cancelLabelUrdu,
  icon,
  ...props
}) => {
  return (
    <Modal
      {...props}
      isConfirmation={true}
      confirmationIcon={icon}
      title={title}
      titleUrdu={titleUrdu}
      primaryAction={{
        label: confirmLabel || 'Confirm',
        labelUrdu: confirmLabelUrdu || 'تصدیق کریں',
        onClick: onConfirm
      }}
      secondaryAction={{
        label: cancelLabel || 'Cancel',
        labelUrdu: cancelLabelUrdu || 'منسوخ کریں',
        onClick: onCancel
      }}
    >
      <p className="text-gray-600 dark:text-gray-400">
        {language === 'ur' ? messageUrdu : message}
      </p>
    </Modal>
  );
};

Modal.success = ({
  title,
  titleUrdu,
  message,
  messageUrdu,
  onClose,
  closeLabel,
  closeLabelUrdu,
  ...props
}) => {
  return (
    <Modal
      {...props}
      isConfirmation={true}
      confirmationIcon={HiCheckCircle}
      title={title}
      titleUrdu={titleUrdu}
      primaryAction={{
        label: closeLabel || 'Close',
        labelUrdu: closeLabelUrdu || 'بند کریں',
        onClick: onClose,
        gradientDuoTone: "greenToBlue"
      }}
    >
      <p className="text-gray-600 dark:text-gray-400">
        {language === 'ur' ? messageUrdu : message}
      </p>
    </Modal>
  );
};

Modal.error = ({
  title,
  titleUrdu,
  message,
  messageUrdu,
  onClose,
  closeLabel,
  closeLabelUrdu,
  ...props
}) => {
  return (
    <Modal
      {...props}
      isConfirmation={true}
      confirmationIcon={HiExclamationCircle}
      title={title}
      titleUrdu={titleUrdu}
      primaryAction={{
        label: closeLabel || 'Close',
        labelUrdu: closeLabelUrdu || 'بند کریں',
        onClick: onClose,
        gradientDuoTone: "pinkToOrange"
      }}
    >
      <p className="text-gray-600 dark:text-gray-400">
        {language === 'ur' ? messageUrdu : message}
      </p>
    </Modal>
  );
};

export default Modal;