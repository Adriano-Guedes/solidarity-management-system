import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Table } from 'react-bootstrap';
import { FiX, FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { getAllActiveItems } from '../../items/itemService';
import type { ItemResponse } from '../../../types/item';
import type { CreateDonationRequest, DonationItemRequest } from '../../../types/donation';

interface DonationCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: CreateDonationRequest) => void;
  loading?: boolean;
}

const DonationCreateModal: React.FC<DonationCreateModalProps> = ({ show, onClose, onSave, loading = false }) => {
  const [form, setForm] = useState<CreateDonationRequest>({
    receivedDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: []
  });

  const [activeItems, setActiveItems] = useState<ItemResponse[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (show) {
      getAllActiveItems().then(setActiveItems);
      setForm({
        receivedDate: new Date().toISOString().split('T')[0],
        notes: '',
        items: []
      });
      setErrors({});
      setTouched({});
    }
  }, [show]);

  const validate = (formData: CreateDonationRequest) => {
    const newErrors: Record<string, string> = {};

    if (!formData.receivedDate) {
      newErrors.receivedDate = 'A data de recebimento é obrigatória.';
    }

    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = 'As observações devem ter no máximo 1000 caracteres.';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'A doação deve conter ao menos um item.';
    } else {
      formData.items.forEach((item, index) => {
        if (!item.itemId) {
          newErrors[`item_${index}_id`] = 'O item é obrigatório.';
        }
        if (item.quantity <= 0) {
          newErrors[`item_${index}_quantity`] = 'A quantidade deve ser maior que zero.';
        }
      });
    }

    return newErrors;
  };

  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleAddItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', quantity: 1, expirationDate: undefined }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: keyof DonationItemRequest, value: any) => {
    setForm(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: field === 'quantity' ? Number(value) : value };
      return { ...prev, items: newItems };
    });
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
      size="xl"
      contentClassName="border-0 shadow-lg"
      style={{ zIndex: 20000 }}
    >
      <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
        <Modal.Header style={{ borderBottom: '1px solid var(--border)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <div>
            <Modal.Title style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>Registrar Nova Doação</Modal.Title>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registre a entrada de novos itens doados ao estoque</div>
          </div>
          <button className="btn-icon-sm" onClick={onClose} style={{ fontSize: '20px' }}>
            <FiX />
          </button>
        </Modal.Header>
        
        <Modal.Body style={{ padding: '24px', background: '#fff' }}>
          <Form autoComplete="off">
            <Row className="g-3 mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>
                    Data de Recebimento <span style={{ color: 'var(--danger)' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    name="receivedDate"
                    type="date"
                    value={form.receivedDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.receivedDate && !!errors.receivedDate}
                    style={inputStyle}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.receivedDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Observações / Notas</Form.Label>
                  <Form.Control
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.notes && !!errors.notes}
                    style={inputStyle}
                    placeholder="Informações adicionais sobre esta doação..."
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.notes}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h5 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Itens da Doação</h5>
              <button 
                type="button" 
                className="btn-primary-custom" 
                onClick={handleAddItem}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                <FiPlus /> Adicionar Item
              </button>
            </div>

            {errors.items && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3" style={{ fontSize: '13px' }}>
                <FiAlertCircle size={16} /> {errors.items}
              </div>
            )}

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Item <span style={{ color: 'var(--danger)' }}>*</span></th>
                    <th>Quantidade <span style={{ color: 'var(--danger)' }}>*</span></th>
                    <th>Data de Validade</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ minWidth: '300px' }}>
                        <Form.Select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                          isInvalid={!!errors[`item_${index}_id`]}
                          style={{ ...inputStyle, background: 'var(--body-bg)' }}
                        >
                          <option value="">Selecione um item...</option>
                          {activeItems.map(ai => (
                            <option key={ai.id} value={ai.id}>{ai.name} ({ai.brand})</option>
                          ))}
                        </Form.Select>
                      </td>
                      <td style={{ width: '150px' }}>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          isInvalid={!!errors[`item_${index}_quantity`]}
                          style={{ ...inputStyle, background: 'var(--body-bg)' }}
                        />
                      </td>
                      <td style={{ width: '200px' }}>
                        <Form.Control
                          type="date"
                          value={item.expirationDate || ''}
                          onChange={(e) => handleItemChange(index, 'expirationDate', e.target.value)}
                          style={{ ...inputStyle, background: 'var(--body-bg)' }}
                        />
                      </td>
                      <td className="text-end">
                        <button 
                          type="button" 
                          className="btn-icon-sm danger" 
                          onClick={() => handleRemoveItem(index)}
                          style={{ border: 'none' }}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {form.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-muted">
                        Clique em "Adicionar Item" para começar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                Registrando...
              </>
            ) : (
              <><FiPlus /> Registrar Doação</>
            )}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default DonationCreateModal;
