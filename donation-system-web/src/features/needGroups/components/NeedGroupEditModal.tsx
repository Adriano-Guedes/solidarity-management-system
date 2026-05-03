import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { FiSave } from 'react-icons/fi';
import type { NeedGroupResponse, UpdateNeedGroupRequest } from '../../../types/needGroup';

interface NeedGroupEditModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateNeedGroupRequest) => void;
  loading?: boolean;
  initialData: NeedGroupResponse | null;
}

const NeedGroupEditModal: React.FC<NeedGroupEditModalProps> = ({ show, onClose, onSave, loading = false, initialData }) => {
  const [form, setForm] = useState<UpdateNeedGroupRequest>({
    name: '',
    active: true
  });

  useEffect(() => {
    if (initialData && show) {
      setForm({
        name: initialData.name,
        active: initialData.active
      });
    }
  }, [initialData, show]);

  const validate = (formData: UpdateNeedGroupRequest) => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const currentErrors = validate(form);
  const isFormValid = Object.keys(currentErrors).length === 0;

  const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' };
  const inputStyle: React.CSSProperties = { borderRadius: '10px', border: '1px solid var(--border)', padding: '10px 14px', fontSize: '14px' };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <div className="p-3">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Editar Grupo de Necessidade</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Nome do Grupo *</Form.Label>
                  <Form.Control name="name" value={form.name} onChange={handleChange} isInvalid={!!currentErrors.name} style={inputStyle} />
                  <Form.Control.Feedback type="invalid">{currentErrors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Check type="switch" label="Ativo" name="active" checked={form.active} onChange={handleChange} />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary-custom" onClick={() => initialData && onSave(initialData.id, form)} disabled={loading || !isFormValid}>
            {loading ? 'Salvando...' : <><FiSave className="me-1" /> Salvar</>}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default NeedGroupEditModal;
