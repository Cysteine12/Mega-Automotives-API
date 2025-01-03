import Cart from '../models/Cart.js'
import { NotFoundError, ValidationError } from '../middlewares/errorHandler.js'

const viewCart = async (req, res, next) => {
    try {
        const user = req.user._id

        const cart = await Cart.findOne({ user })
            .populate('items.inventory')
            .lean()

        res.status(200).json({
            success: true,
            data: cart,
        })
    } catch (err) {
        next(err)
    }
}

const addItem = async (req, res, next) => {
    try {
        const user = req.user._id
        const newItem = {
            items: [
                {
                    inventory: req.body.inventory,
                    quantity: req.body.quantity,
                },
            ],
            status: 'Pending',
        }

        const updatedCart = await Cart.findOneAndUpdate(
            { user },
            {
                $push: {
                    items: [newItem.items[0]],
                },
            }
        )

        if (!updatedCart) {
            const cart = new Cart({ user, ...newItem })
            await cart.save()
        }

        res.status(200).json({
            success: true,
            message: 'Added to cart',
        })
    } catch (err) {
        next(err)
    }
}

const editItem = async (req, res, next) => {
    try {
        const _id = req.params.id
        const user = req.user._id
        const newItem = {
            quantity: req.body.quantity,
        }

        const updatedCart = await Cart.findOneAndUpdate(
            {
                user,
                'items._id': _id,
            },
            {
                'items.$.quantity': newItem.quantity,
            }
        )

        if (!updatedCart) {
            throw new NotFoundError('Cart not found')
        }

        res.status(200).json({
            success: true,
            message: 'Cart updated',
        })
    } catch (err) {
        next(err)
    }
}

const removeItem = async (req, res, next) => {
    try {
        const _id = req.params.id
        const user = req.user._id

        const cart = await Cart.findOneAndUpdate(
            { user },
            {
                $pull: {
                    items: {
                        _id: _id,
                    },
                },
            }
        )

        if (!cart) {
            throw new NotFoundError('Cart not found')
        }

        res.status(200).json({
            success: true,
            message: 'Item removed',
        })
    } catch (err) {
        next(err)
    }
}

const clearCart = async (req, res, next) => {
    try {
        const user = req.user._id

        const cart = await Cart.findOneAndDelete({ user })

        if (!cart) {
            throw new NotFoundError('Cart not found')
        }

        res.status(200).json({
            success: true,
            message: 'Cart cleared',
        })
    } catch (err) {
        next(err)
    }
}

export default {
    viewCart,
    addItem,
    editItem,
    removeItem,
    clearCart,
}
