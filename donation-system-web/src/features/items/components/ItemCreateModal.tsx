import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { FiX, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { getAllItemCategories } from '../../../features/itemCategories/itemCategoryService';
import { getAllItemTemplates } from '../../../features/itemTemplates/itemTemplateService';
import type { ItemCategoryResponse } from '../../../types/itemCategory';
import type { ItemTemplateResponse } from '../../../types/itemTemplate';
import type { CreateItemRequest } from '../../../types/item';

interface ItemCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: CreateItemRequest) => void;
  loading?: boolean;
}

const ItemCreateModal: React.FC<ItemCreateModalProps> = ({ show, onClose, onSave, loading = false }) => {
  const [form, setForm] = useState<CreateItemRequest>({
    name: '',
    brand: '',
    categoryId: '',
    itemTemplateId: '',
    packageQuantity: 0,
    unitOfMeasure: '',
    notes: '',
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [categories, setCategories] = useState<ItemCategoryResponse[]>([]);
  const [templates, setTemplates] = useState<ItemTemplateResponse[]>([]);

  const filteredTemplates = templates.filter(t => t.categoryId === form.categoryId);

  const validate = (formData: CreateItemRequest) => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'O nome do item é obrigatório.';
    } else if (formData.name.length < 2 || formData.name.length > 150) {
      newErrors.name = 'O nome deve ter entre 2 e 150 caracteres.';
    }

    if (formData.brand && formData.brand.length > 100) {
      newErrors.brand = 'A marca deve ter no máximo 100 caracteres.';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'A categoria do item é obrigatória.';
    }

    if (!formData.itemTemplateId) {
      newErrors.itemTemplateId = 'O modelo base do item é obrigatório.';
    }

    if (formData.packageQuantity <= 0) {
      newErrors.packageQuantity = 'A quantidade deve ser maior que zero.';
    }

    if (formData.unitOfMeasure && formData.unitOfMeasure.length > 30) {
      newErrors.unitOfMeasure = 'A unidade de medida deve ter no máximo 30 caracteres.';
    }

    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = 'As observações devem ter no máximo 1000 caracteres.';
    }

    return newErrors;
  };

  useEffect(() => {
    if (show) {
      getAllItemCategories().then(setCategories);
      getAllItemTemplates().then(setTemplates);
      // Reset form and validation state when opening
      setForm({
        name: '',
        brand: '',
        categoryId: '',
        itemTemplateId: '',
        packageQuantity: 0,
        unitOfMeasure: '',
        notes: '',
        active: true
      });
      setErrors({});
      setTouched({});
    }
  }, [show]);

  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setForm((prev) => {
      const updatedValue = type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : (name === 'packageQuantity' ? Number(value) : value);
      
      const nextForm = { ...prev, [name]: updatedValue };

      if (name === 'categoryId') {
        const templateExistsInNewCategory = templates.some(
          t => t.id === prev.itemTemplateId && t.categoryId === value
        );
        if (!templateExistsInNewCategory) {
          nextForm.itemTemplateId = '';
        }
      }

      return nextForm;
    });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
            <Modal.Title style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>Cadastrar Novo Item</Modal.Title>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Preencha as informações para adicionar um item ao catálogo</div>
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
                    Nome do Item <span style={{ color: 'var(--danger)' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.name && !!errors.name}
                    style={inputStyle}
                    placeholder="Ex: Arroz Agulhinha"
                    autoFocus
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Marca</Form.Label>
                  <Form.Control
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.brand && !!errors.brand}
                    style={inputStyle}
                    placeholder="Ex: Tio João"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.brand}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>
                    Categoria <span style={{ color: 'var(--danger)' }}>*</span>
                  </Form.Label>
                  <Form.Select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.categoryId && !!errors.categoryId}
                    style={{ ...inputStyle, appearance: 'auto' }}
                    required
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.categoryId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>
                    Modelo Base (Template) <span style={{ color: 'var(--danger)' }}>*</span>
                  </Form.Label>
                  <Form.Select
                    name="itemTemplateId"
                    value={form.itemTemplateId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.itemTemplateId && !!errors.itemTemplateId}
                    style={{ ...inputStyle, appearance: 'auto' }}
                    required
                    disabled={!form.categoryId}
                  >
                    <option value="">
                      {!form.categoryId ? 'Selecione primeiro uma categoria...' : 'Selecione um modelo base...'}
                    </option>
                    {filteredTemplates.map(tpl => (
                      <option key={tpl.id} value={tpl.id}>{tpl.name} ({tpl.categoryName})</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.itemTemplateId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>
                    Quantidade por Pacote <span style={{ color: 'var(--danger)' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    name="packageQuantity"
                    type="number"
                    step="0.01"
                    value={form.packageQuantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.packageQuantity && !!errors.packageQuantity}
                    style={inputStyle}
                    placeholder="Ex: 5"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.packageQuantity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Unidade de Medida</Form.Label>
                  <Form.Control
                    name="unitOfMeasure"
                    value={form.unitOfMeasure}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.unitOfMeasure && !!errors.unitOfMeasure}
                    style={inputStyle}
                    placeholder="Ex: kg, un, litros"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.unitOfMeasure}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Observações / Notas</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.notes && !!errors.notes}
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder="Informações adicionais sobre o item..."
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.notes}
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
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>Status Inicial</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Itens novos são criados como ativos por padrão</div>
                    </div>
                  </div>
                  <Form.Check
                    type="switch"
                    id="create-active-switch"
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
              minWidth: '160px', 
              justifyContent: 'center', 
              borderRadius: '10px',
              opacity: (loading || !isFormValid) ? 0.6 : 1,
              cursor: (loading || !isFormValid) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cadastrando...
              </>
            ) : (
              <><FiPlus /> Cadastrar Item</>
            )}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ItemCreateModal;
