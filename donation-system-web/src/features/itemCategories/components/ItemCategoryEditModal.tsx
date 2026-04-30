import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { FiX, FiSave, FiAlertCircle } from 'react-icons/fi';
import type { ItemCategoryResponse, UpdateItemCategoryRequest } from '../../../types/itemCategory';

interface ItemCategoryEditModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: UpdateItemCategoryRequest) => void;
  loading?: boolean;
  initialData?: ItemCategoryResponse | null;
}

const ItemCategoryEditModal: React.FC<ItemCategoryEditModalProps> = ({ show, onClose, onSave, loading = false, initialData }) => {
  const [form, setForm] = useState<UpdateItemCategoryRequest>({
    name: '',
    description: '',
    active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (formData: UpdateItemCategoryRequest) => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'O nome da categoria é obrigatório.';
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'O nome da categoria deve ter entre 2 e 100 caracteres.';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'A descrição deve ter no máximo 500 caracteres.';
    }

    return newErrors;
  };

  useEffect(() => {
    if (show) {
      setErrors({});
      setTouched({});
    }
  }, [show]);

  useEffect(() => {
    if (initialData && show) {
      setForm({
        name: initialData.name,
        description: initialData.description || '',
        active: initialData.active,
      });
    }
  }, [initialData, show]);

  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const isFormValid = Object.keys(errors).length === 0;

  const inputStyle: React.CSSProperties = {
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--body-bg)',
    padding: '10px 14px',
    fontSize: '14px',
    color: 'var(--text-main)',
    transition: 'border-color var(--transition)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      backdrop="static" 
      size="lg"
      contentClassName="border-0 shadow-lg"
      style={{ zIndex: 20000 }}
    >
      <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
        <Modal.Header style={{ borderBottom: '1px solid var(--border)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <div>
            <Modal.Title style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>Editar Categoria</Modal.Title>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Atualize as informações de identificação e status desta categoria</div>
          </div>
          <button className="btn-icon-sm" onClick={onClose} style={{ fontSize: '20px' }}>
            <FiX />
          </button>
        </Modal.Header>
        
        <Modal.Body style={{ padding: '24px', background: '#fff' }}>
          <Form autoComplete="off">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>
                    Nome da Categoria <span style={{ color: 'var(--danger)' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.name && !!errors.name}
                    style={inputStyle}
                    placeholder="Ex: Alimentos, Vestuário, Higiene"
                    autoFocus
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.description && !!errors.description}
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                    placeholder="Breve descrição sobre o que esta categoria abrange..."
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <div style={{ 
                  background: 'var(--primary-light)', 
                  padding: '12px 16px', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '10px', 
                      background: '#fff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
                      <FiAlertCircle size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>Status da Categoria</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Inativar uma categoria oculta itens vinculados em algumas buscas</div>
                    </div>
                  </div>
                  <Form.Check
                    type="switch"
                    id="edit-category-active-switch"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    label={form.active ? 'Ativo' : 'Inativo'}
                    style={{ fontWeight: 600, color: form.active ? 'var(--success)' : 'var(--danger)' }}
                  />
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', background: '#f8fafc', display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            className="btn-ghost" 
            onClick={onClose} 
            disabled={loading}
            style={{ padding: '10px 20px', borderRadius: '10px' }}
          >
            Cancelar
          </button>
          <button 
            type="button"
            className="btn-primary-custom" 
            onClick={() => onSave(form)} 
            disabled={loading || !isFormValid}
            style={{ 
              padding: '10px 24px', 
              minWidth: '180px', 
              justifyContent: 'center', 
              borderRadius: '10px',
              opacity: (loading || !isFormValid) ? 0.6 : 1,
              cursor: (loading || !isFormValid) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Salvando...
              </>
            ) : (
              <><FiSave /> Salvar Alterações</>
            )}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ItemCategoryEditModal;