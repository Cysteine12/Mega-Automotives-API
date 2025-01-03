import Service from '../models/Service.js'
import Subservice from '../models/Subservice.js'
import notificationService from '../services/notificationService.js'
import { NotFoundError, ValidationError } from '../middlewares/errorHandler.js'

const getServices = async (req, res, next) => {
    try {
        const services = await Service.find()
            .populate('subservices')
            .sort({ updatedAt: -1 })
            .lean()

        res.status(200).json({
            success: true,
            data: services,
        })
    } catch (err) {
        next(err)
    }
}

const getSubserviceById = async (req, res, next) => {
    try {
        const { id } = req.params

        const subservice = await Subservice.findById(id).lean()

        if (!subservice) {
            throw new NotFoundError('Service not found')
        }

        res.status(200).json({
            success: true,
            data: subservice,
        })
    } catch (err) {
        next(err)
    }
}

const createService = async (req, res, next) => {
    try {
        const newSubservices = req.body.subservices?.map((subservice) => {
            return {
                name: subservice.name,
                description: subservice.description,
                price: subservice.price,
                duration: subservice.duration,
                thumbnail: subservice.thumbnail,
                images: subservice.images,
            }
        })

        const savedSubservices = await Subservice.insertMany(newSubservices)

        const newService = {
            category: req.body.category,
            description: req.body.description,
            thumbnail: req.body.thumbnail,
            subservices: savedSubservices?.map((subservice) => {
                return subservice._id
            }),
        }

        const service = new Service(newService)
        const savedService = await service.save()

        await notificationService.serviceCreated(req.user, savedService)

        res.status(200).json({
            success: true,
            message: 'Service created successfully',
        })
    } catch (err) {
        next(err)
    }
}

const updateService = async (req, res, next) => {
    try {
        const { id } = req.params
        const newService = {
            category: req.body.category,
            description: req.body.description,
            thumbnail: req.body.thumbnail,
        }

        const updatedService = await Service.findByIdAndUpdate(id, newService)

        if (!updatedService) {
            throw new NotFoundError('Service not found')
        }

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
        })
    } catch (err) {
        next(err)
    }
}

const addSubservices = async (req, res, next) => {
    try {
        const { id } = req.params
        const newSubservices = req.body.map((subservice) => {
            return {
                name: subservice.name,
                description: subservice.description,
                price: subservice.price,
                duration: subservice.duration,
                thumbnail: subservice.thumbnail,
                images: subservice.images,
            }
        })

        const savedSubservices = await Subservice.insertMany(newSubservices)

        const updatedService = await Service.findByIdAndUpdate(id, {
            $push: {
                subservices: savedSubservices,
            },
        })

        if (!updatedService) {
            throw new NotFoundError('Service not found')
        }

        await notificationService.serviceCreated(req.user, updatedService)

        res.status(200).json({
            success: true,
            message: 'Subservice(s) added successfully',
        })
    } catch (err) {
        next(err)
    }
}

const editSubservice = async (req, res, next) => {
    try {
        const { id } = req.params
        const newSubservice = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            duration: req.body.duration,
            availability: req.body.availability,
            thumbnail: req.body.thumbnail,
            images: req.body.images,
        }

        const updatedSubservice = await Subservice.findByIdAndUpdate(
            id,
            newSubservice
        )

        if (!updatedSubservice) {
            throw new NotFoundError('Subservice not found')
        }

        res.status(200).json({
            success: true,
            message: 'Subservice updated successfully',
        })
    } catch (err) {
        next(err)
    }
}

const removeSubservice = async (req, res, next) => {
    try {
        const serviceId = req.params.id
        const subserviceId = req.body._id

        const [subservice, updatedService] = await Promise.all([
            Subservice.findByIdAndDelete(subserviceId),
            Service.findByIdAndUpdate(serviceId, {
                $pull: {
                    subservices: subserviceId,
                },
            }),
        ])

        if (!subservice || !updatedService) {
            throw new NotFoundError('Subservice not found')
        }

        res.status(200).json({
            success: true,
            message: 'Subservice removed successfully',
        })
    } catch (err) {
        next(err)
    }
}

const deleteService = async (req, res, next) => {
    try {
        const { id } = req.params

        const service = await Service.findById(id).lean()

        if (!service) {
            throw new NotFoundError('Service not found')
        }

        const [deletedSubservices, deletedService] = await Promise.all([
            Subservice.deleteMany({
                _id: { $in: service.subservices },
            }),
            Service.findByIdAndDelete(id),
        ])

        if (!deletedSubservices || !deletedService) {
            throw new NotFoundError('Service not found')
        }

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully',
        })
    } catch (err) {
        next(err)
    }
}

export default {
    getServices,
    getSubserviceById,
    createService,
    updateService,
    addSubservices,
    editSubservice,
    removeSubservice,
    deleteService,
}
