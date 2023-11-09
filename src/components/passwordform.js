const { useState } = require('react');
const { Input, Button, Modal } = require('antd');

export default function NewPasswordForm ({ visible, onClose, onSave }) {
  const [serviceName, setServiceName] = useState('');
  const [serviceURL, setServiceURL] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleSave = () => {
    console.log("Form values:", serviceName, serviceURL, userPassword);
    onSave({
      serviceName,
      serviceURL,
      userPassword,
    });
    setServiceName('');
    setServiceURL('');
    setUserPassword('');
  };

  return (
    <Modal
      title="Nueva Contraseña"
      visible={visible}
      onCancel={onClose}
      onOk={handleSave}
    >
      <div>
        <label>Nombre del Servicio</label>
        <Input value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
      </div>
      <div>
        <label>URL del Servicio</label>
        <Input value={serviceURL} onChange={(e) => setServiceURL(e.target.value)} />
      </div>
      <div>
        <label>Contraseña del Usuario</label>
        <Input.Password value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
      </div>
    </Modal>
  );
}