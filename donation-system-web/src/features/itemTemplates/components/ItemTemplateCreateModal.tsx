import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import { getActiveItemCategories } from '../../itemCategories/itemCategoryService';
import { getActiveNeedGroups } from '../../needGroups/needGroupService';
import type { ItemCategoryResponse } from '../../../types/itemCategory';
import type { NeedGroupResponse } from '../../../types/needGroup';
import type { CreateItemTemplateRequest } from '../../../types/itemTemplate';

interface ItemTemplateCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: CreateItemTemplateRequest) => void;
  loading?: boolean;
}

const ItemTemplateCreateModal: React.FC<ItemTemplateCreateModalProps> = ({ show, onClose, onSave, loading = false }) => {
  const [form, setForm] = useState<CreateItemTemplateRequest>({
    name: '',
    categoryId: '',
    needGroupId: '',
    isPerishable: false,
    requiresRefrigeration: false,
    suitableForAutoSuggestion: true,
    requiresManualAnalysis: false,
    defaultUnitOfMeasure: '',
    notes: '',
    active: true
  });

  const [categories, setCategories] = useState<ItemCategoryResponse[]>([]);
  const [needGroups, setNeedGroups] = useState<NeedGroupResponse[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (show) {
      getActiveItemCategories().then(setCategories);
      getActiveNeedGroups().then(setNeedGroups);
      setForm({
        name: '',
        categoryId: '',
        needGroupId: '',
        isPerishable: false,
        requiresRefrigeration: false,
        suitableForAutoSuggestion: true,
        requiresManualAnalysis: false,
        defaultUnitOfMeasure: '',
        notes: '',
        active: true
      });
      setErrors({});
    }
  }, [show]);

  const validate = (formData: CreateItemTemplateRequest) => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
    if (!formData.categoryId) newErrors.categoryId = 'A categoria é obrigatória.';
    if (!formData.needGroupId) newErrors.needGroupId = 'O grupo de necessidade é obrigatório.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(form);
  };

  const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' };
  const inputStyle: React.CSSProperties = { borderRadius: '10px', border: '1px solid var(--border)', padding: '10px 14px', fontSize: '14px' };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" backdrop="static">
      <div className="p-3">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Novo Modelo de Item</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Nome do Modelo *</Form.Label>
                  <Form.Control name="name" value={form.name} onChange={handleChange} isInvalid={!!errors.name} style={inputStyle} placeholder="Ex: Arroz Agulhinha 5kg" />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Categoria *</Form.Label>
                  <Form.Select name="categoryId" value={form.categoryId} onChange={handleChange} isInvalid={!!errors.categoryId} style={inputStyle}>
                    <option value="">Selecione...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.categoryId}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Grupo de Necessidade *</Form.Label>
                  <Form.Select name="needGroupId" value={form.needGroupId} onChange={handleChange} isInvalid={!!errors.needGroupId} style={inputStyle}>
                    <option value="">Selecione...</option>
                    {needGroups.map(ng => <option key={ng.id} value={ng.id}>{ng.name}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.needGroupId}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Unidade de Medida Padrão</Form.Label>
                  <Form.Control name="defaultUnitOfMeasure" value={form.defaultUnitOfMeasure} onChange={handleChange} style={inputStyle} placeholder="Ex: kg, un, l" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Row className="g-3 mt-1">
                  <Col md={6}>
                    <Form.Check type="switch" name="isPerishable" label="Perecível" checked={form.isPerishable} onChange={handleChange} />
                  </Col>
                  <Col md={6}>
                    <Form.Check type="switch" name="requiresRefrigeration" label="Requer Refrigeração" checked={form.requiresRefrigeration} onChange={handleChange} />
                  </Col>
                  <Col md={6}>
                    <Form.Check type="switch" name="suitableForAutoSuggestion" label="Adequado para Sugestão Automática" checked={form.suitableForAutoSuggestion} onChange={handleChange} />
                  </Col>
                  <Col md={6}>
                    <Form.Check type="switch" name="requiresManualAnalysis" label="Requer Análise Manual" checked={form.requiresManualAnalysis} onChange={handleChange} />
                  </Col>
                </Row>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Observações</Form.Label>
                  <Form.Control as="textarea" rows={2} name="notes" value={form.notes} onChange={handleChange} style={inputStyle} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary-custom" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Cadastrando...' : <><FiPlus className="me-1" /> Cadastrar Modelo</>}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ItemTemplateCreateModal;
