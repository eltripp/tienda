import { useState } from "react";
import { ArrowLeft, Save, X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function ProductForm({ product }: { product?: any }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    description: product?.description || "",
    price: product?.price || "",
    compareAtPrice: product?.compareAtPrice || "",
    stock: product?.stock || "",
    category: product?.category || "",
    brand: product?.brand || "",
    tags: product?.tags || [],
    weight: product?.weight || "",
    featured: product?.featured || false,
    active: product?.active !== undefined ? product.active : true,
    images: product?.images || [],
  });

  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = () => {
    // En una app real, esto abriría un selector de archivos
    console.log("Subir imagen");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // En una app real, aquí se enviarían los datos a la API
      console.log("Guardar producto:", formData);

      // Simulación de espera
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirigir a la lista de productos
      // router.push("/admin/products");
    } catch (error) {
      console.error("Error al guardar producto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Inventario</p>
          <h1 className="font-heading text-3xl text-slate-100">
            {product ? "Editar producto" : "Nuevo producto"}
          </h1>
          <p className="text-sm text-slate-400">
            {product ? "Actualiza la información del producto." : "Agrega un nuevo producto al catálogo."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Columna izquierda - Información principal */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-slate-900/70 bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Información básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300">
                    Nombre del producto
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nombre del producto"
                    className="bg-slate-900/50 border-slate-800"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku" className="text-slate-300">
                    SKU
                  </Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="SKU del producto"
                    className="bg-slate-900/50 border-slate-800"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-slate-300">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descripción detallada del producto"
                    rows={5}
                    className="bg-slate-900/50 border-slate-800 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-900/70 bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Imágenes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {formData.images.length > 0 ? (
                    formData.images.map((image, index) => (
                      <div key={index} className="relative h-24 w-24 rounded-md bg-slate-800 overflow-hidden">
                        <img
                          src={image}
                          alt={`Imagen ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-24 w-24 rounded-md bg-slate-800 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-slate-600" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="h-24 w-24 rounded-md border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs">Subir</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Configuración */}
          <div className="space-y-6">
            <Card className="border-slate-900/70 bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Precios y stock</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price" className="text-slate-300">
                    Precio
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-slate-900/50 border-slate-800"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="compareAtPrice" className="text-slate-300">
                    Precio de comparación
                  </Label>
                  <Input
                    id="compareAtPrice"
                    name="compareAtPrice"
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
                <div>
                  <Label htmlFor="stock" className="text-slate-300">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-slate-900/50 border-slate-800"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-slate-300">
                    Peso (kg)
                  </Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-900/70 bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Categorización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-slate-300">
                    Categoría
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-800">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-900">
                      <SelectItem value="laptops">Laptops</SelectItem>
                      <SelectItem value="smartphones">Smartphones</SelectItem>
                      <SelectItem value="tablets">Tablets</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="accessories">Accesorios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="brand" className="text-slate-300">
                    Marca
                  </Label>
                  <Select
                    value={formData.brand}
                    onValueChange={(value) => handleSelectChange("brand", value)}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-800">
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-900">
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="samsung">Samsung</SelectItem>
                      <SelectItem value="dell">Dell</SelectItem>
                      <SelectItem value="hp">HP</SelectItem>
                      <SelectItem value="lenovo">Lenovo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-900/70 bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Etiquetas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nueva etiqueta"
                    className="bg-slate-900/50 border-slate-800"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800"
                  >
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-slate-700 bg-slate-900/50 text-slate-300 pr-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-slate-500 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-900/70 bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Visibilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured" className="text-slate-300">
                    Producto destacado
                  </Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="active" className="text-slate-300">
                    Activo
                  </Label>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleSwitchChange("active", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-500 py-2 font-semibold text-emerald-950 hover:bg-emerald-400"
            >
              {isSubmitting ? (
                "Guardando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {product ? "Actualizar producto" : "Guardar producto"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
