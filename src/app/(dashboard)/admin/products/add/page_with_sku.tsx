"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct } = useProducts();

  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    highlights: "",
    price: 0,
    compareAtPrice: 0,
    stock: 0,
    sku: "",
    weight: 0,
    featured: false,
    isActive: true,
    tags: "",
  });

  // Estados para las especificaciones
  const [specifications, setSpecifications] = useState([
    { name: "", value: "" }
  ]);

  // Estados para las imágenes
  const [images, setImages] = useState([
    { url: "", alt: "", isPrimary: true }
  ]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  // Manejar cambios en los switches
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Añadir una nueva especificación
  const addSpecification = () => {
    setSpecifications(prev => [...prev, { name: "", value: "" }]);
  };

  // Actualizar una especificación
  const updateSpecification = (index: number, field: "name" | "value", value: string) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setSpecifications(updatedSpecs);
  };

  // Eliminar una especificación
  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Añadir una nueva imagen
  const addImage = () => {
    setImages(prev => [...prev, { url: "", alt: "", isPrimary: false }]);
  };

  // Actualizar una imagen
  const updateImage = (index: number, field: "url" | "alt", value: string) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setImages(updatedImages);
  };

  // Marcar imagen como primaria
  const setPrimaryImage = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setImages(updatedImages);
  };

  // Eliminar una imagen
  const removeImage = (index: number) => {
    if (images.length > 1) {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Generar slug a partir del nombre
  const generateSlug = () => {
    if (!formData.name) {
      console.log("generateSlug: No hay nombre, generando slug por defecto");
      setFormData(prev => ({ ...prev, slug: `producto-${Date.now()}` }));
      return;
    }

    const slug = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      || `producto-${Date.now()}`; // Slug por si todo falla

    console.log("generateSlug: Slug generado:", slug);
    setFormData(prev => ({ ...prev, slug }));
  };

  // Generar SKU a partir del nombre
  const generateSKU = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const prefix = cleanName.substring(0, Math.min(5, cleanName.length));
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
  };

  // Guardar nuevo producto
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!formData.name || !formData.slug || !formData.description || !formData.sku) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    // Asegurarse de que el slug sea válido
    if (!formData.slug || formData.slug.trim() === "") {
      generateSlug();
      alert("Se ha generado un slug automáticamente para el producto");
      return;
    }

    // Convertir tags de string a array
    const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(Boolean);

    // Preparar datos del nuevo producto
    const newProduct = {
      ...formData,
      tags: tagsArray,
      specifications: { create: specifications },
      images: { create: images },
    };

    // Añadir el producto usando el hook
    addProduct(newProduct);
    alert("Producto creado correctamente");
    router.push("/admin/products");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-heading text-3xl text-slate-100">Nuevo producto</h1>
          <p className="text-sm text-slate-400">Añade un nuevo producto al catálogo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-lg text-slate-100">Información básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Nombre</Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={generateSlug}
                    className="bg-slate-900/50 border-slate-700 text-slate-100 flex-1"
                    required
                  />
                  <Button
                    type="button"
                    onClick={generateSlug}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                  >
                    Generar Slug
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-slate-300">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="bg-slate-900/50 border-slate-700 text-slate-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="bg-slate-900/50 border-slate-700 text-slate-100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlights" className="text-slate-300">Puntos destacados</Label>
              <Textarea
                id="highlights"
                name="highlights"
                value={formData.highlights}
                onChange={handleChange}
                rows={2}
                className="bg-slate-900/50 border-slate-700 text-slate-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-slate-300">Etiquetas (separadas por comas)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="bg-slate-900/50 border-slate-700 text-slate-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Información de precio y stock */}
        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-lg text-slate-100">Precio e inventario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-slate-300">Precio</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="bg-slate-900/50 border-slate-700 text-slate-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compareAtPrice" className="text-slate-300">Precio de comparación</Label>
                <Input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  className="bg-slate-900/50 border-slate-700 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-slate-300">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  className="bg-slate-900/50 border-slate-700 text-slate-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku" className="text-slate-300">SKU</Label>
                <div className="flex gap-2">
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-700 text-slate-100 flex-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newSKU = generateSKU(formData.name);
                      setFormData(prev => ({ ...prev, sku: newSKU }));
                    }}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                  >
                    Generar SKU
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-slate-300">Peso (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={handleChange}
                  className="bg-slate-900/50 border-slate-700 text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                />
                <Label htmlFor="featured" className="text-slate-300">Destacado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
                <Label htmlFor="isActive" className="text-slate-300">Activo</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Especificaciones */}
        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-100">Especificaciones</CardTitle>
            <Button
              type="button"
              onClick={addSpecification}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
            >
              Añadir especificación
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor={`spec-name-${index}`} className="text-slate-300">Nombre</Label>
                  <Input
                    id={`spec-name-${index}`}
                    value={spec.name}
                    onChange={(e) => updateSpecification(index, "name", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`spec-value-${index}`} className="text-slate-300">Valor</Label>
                  <Input
                    id={`spec-value-${index}`}
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, "value", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-slate-100"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeSpecification(index)}
                  disabled={specifications.length === 1}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Imágenes */}
        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-100">Imágenes</CardTitle>
            <Button
              type="button"
              onClick={addImage}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
            >
              Añadir imagen
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="space-y-4 p-4 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {image.url && (
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-800">
                        <img
                          src={image.url}
                          alt={image.alt || "Vista previa"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-100">Imagen {index + 1}</p>
                      {image.isPrimary && (
                        <Badge variant="secondary" className="text-xs">Principal</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPrimaryImage(index)}
                      disabled={image.isPrimary}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                    >
                      {image.isPrimary ? "Principal" : "Establecer como principal"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeImage(index)}
                      disabled={images.length === 1}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`img-url-${index}`} className="text-slate-300">URL</Label>
                    <Input
                      id={`img-url-${index}`}
                      value={image.url}
                      onChange={(e) => updateImage(index, "url", e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`img-alt-${index}`} className="text-slate-300">Texto alternativo</Label>
                    <Input
                      id={`img-alt-${index}`}
                      value={image.alt}
                      onChange={(e) => updateImage(index, "alt", e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-slate-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-emerald-950"
          >
            <Save className="mr-2 h-4 w-4" /> Crear producto
          </Button>
        </div>
      </form>
    </div>
  );
}
