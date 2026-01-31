"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Product = {
  id: number;
  external_id?: number | null;
  name: string;
  sku: string;
  category?: string | null;
  stock?: number | null;
  price: number;
  discounted_price?: number | null;
  status?: string | null;
};

type AddProductForm = {
  name: string;
  description: string;
  price: string;
  discounted_price: string;
  image: string;
  is_available: boolean;
  status: string;
};

const statusColors: Record<string, string> = {
  "in-stock": "bg-green-100 text-green-800 hover:bg-green-100",
  "low-stock": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "out-of-stock": "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<AddProductForm>({
    name: "",
    description: "",
    price: "",
    discounted_price: "",
    image: "",
    is_available: true,
    status: "in stock",
  });

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: (product as any).description || "",
      price: String(product.price ?? ""),
      discounted_price: product.discounted_price ? String(product.discounted_price) : "",
      image: (product as any).image || "",
      is_available: (product as any).is_available ?? true,
      status: (product.status || "in stock").toLowerCase().replace(/-/g, " "),
    });
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
    setEditingProduct(null);
    setSuccessMessage("");
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          console.error("API returned status:", res.status);
          setProducts([]);
          return;
        }

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Fetch failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, is_available: e.target.checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discounted_price: formData.discounted_price
          ? parseFloat(formData.discounted_price)
          : null,
        image: formData.image,
        is_available: formData.is_available,
        status: formData.status,
      };

      // If editingProduct is set, perform PATCH to the external product endpoint
      if (editingProduct) {
        const externalId = (editingProduct.external_id ?? editingProduct.id) as number;
        const url = `https://orghans.pythonanywhere.com/api/products/${externalId}/`;
        const response = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const updated = await response.json();
          setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updated } : p)));
          setSuccessMessage("Product updated successfully!");
          setTimeout(() => {
            closeModal();
          }, 1200);
        } else {
          const errorData = await response.json();
          alert("Error updating product: " + (errorData.detail || errorData.message || "Please try again"));
        }
      } else {
        // Add new product (existing behavior)
        const response = await fetch(
          "https://hansbeauty.pythonanywhere.com/api/add-product/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          const newProduct = await response.json();
          setProducts((prev) => [newProduct, ...prev]);
          setSuccessMessage("Product added successfully!");
          setFormData({
            name: "",
            description: "",
            price: "",
            discounted_price: "",
            image: "",
            is_available: true,
            status: "in stock",
          });
          setTimeout(() => {
            setOpenModal(false);
            setSuccessMessage("");
          }, 1200);
        } else {
          const errorData = await response.json();
          alert("Error adding product: " + (errorData.message || "Please try again"));
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <p className="text-muted-foreground">
          Manage your product inventory and pricing
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>All products with stock levels</CardDescription>
            </div>

            <Button
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: "",
                  description: "",
                  price: "",
                  discounted_price: "",
                  image: "",
                  is_available: true,
                  status: "in stock",
                });
                setOpenModal(true);
              }}
              className="bg-[#E6A8A8] hover:bg-[#D88E8E]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center py-8">Loading products...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="hidden md:table-cell">Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No products available or failed to load.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => {
                      const normalizedStatus =
                        product.status?.toLowerCase().replace(/\s+/g, "-") ?? "unknown";
                      const price = product.discounted_price ?? product.price;

                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                          <TableCell className="hidden sm:table-cell">{product.category ?? "-"}</TableCell>
                          <TableCell>
                            <span className={(product.stock ?? 0) < 10 ? "text-red-600 font-semibold" : ""}>
                              {product.stock ?? "-"}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">${price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[normalizedStatus] || "bg-gray-100 text-gray-800"}>
                              {product.status ?? "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditModal(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={async () => {
                                  const confirmDelete = window.confirm(
                                    "Are you sure you want to delete this product?"
                                  );
                                  if (!confirmDelete) return;

                                  try {
                                    const externalId = (product.external_id ?? product.id) as number;
                                    const res = await fetch(
                                      `https://orghans.pythonanywhere.com/api/products/${externalId}/`,
                                      {
                                        method: "DELETE",
                                      }
                                    );
                                    if (res.ok) {
                                      setProducts((prev) => prev.filter((p) => p.id !== product.id));
                                    } else {
                                      const err = await res.text();
                                      alert("Delete failed: " + err);
                                    }
                                  } catch (err) {
                                    console.error(err);
                                    alert("An error occurred while deleting");
                                  }
                                }}
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>{editingProduct ? "Update the product details below" : "Fill in the product details below"}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                className="w-full min-h-24 p-3 border rounded-md border-input bg-transparent text-base shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discounted_price">Discounted Price</Label>
                <Input
                  id="discounted_price"
                  name="discounted_price"
                  type="number"
                  step="0.01"
                  value={formData.discounted_price}
                  onChange={handleInputChange}
                  placeholder="0.00 (optional)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image *</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {formData.image && <p className="text-sm text-green-600">Image selected ✓</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={handleSelectChange}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in stock">In Stock</SelectItem>
                  <SelectItem value="low stock">Low Stock</SelectItem>
                  <SelectItem value="out of stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="is_available"
                type="checkbox"
                checked={formData.is_available}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="is_available" className="cursor-pointer">
                Product is Available
              </Label>
            </div>

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => closeModal()}>
                Cancel
              </Button>

              {editingProduct && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={async () => {
                    const confirmDelete = window.confirm("Delete this product permanently?");
                    if (!confirmDelete) return;
                    try {
                      const externalId = (editingProduct.external_id ?? editingProduct.id) as number;
                      const res = await fetch(`https://orghans.pythonanywhere.com/api/products/${externalId}/`, {
                        method: "DELETE",
                      });
                      if (res.ok) {
                        setProducts((prev) => prev.filter((p) => p.id !== editingProduct.id));
                        closeModal();
                      } else {
                        const err = await res.text();
                        alert("Delete failed: " + err);
                      }
                    } catch (err) {
                      console.error(err);
                      alert("An error occurred while deleting");
                    }
                  }}
                >
                  Delete
                </Button>
              )}

              <Button type="submit" disabled={submitting} className="bg-[#E6A8A8] hover:bg-[#D88E8E]">
                {submitting ? (editingProduct ? "Saving..." : "Adding...") : editingProduct ? "Save Changes" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
